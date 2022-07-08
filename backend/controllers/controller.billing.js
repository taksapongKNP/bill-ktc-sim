const express = require("express");
const Promise = require('bluebird');
const server = express();
const billingService = require("../services/services.billing");
const billingSubService = require("../services/services.billingSub");
const invoiceService = require("../services/services.invoice");
const uploadLogService = require("../services/services.uploadLog");
const { v4: uuidv4 } = require("uuid");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const JSZip = require("jszip");
const bahttext =require("bahttext");
const pdf =   Promise.promisifyAll(require('html-pdf'));
const pdfToZip =  Promise.promisify(require('html-pdf').create);
// const htmlToPdf = require("html-pdf-node");
const xlsx = require("xlsx");
const ejs = require("ejs");
const { ConsoleMessage } = require("puppeteer");
const zipFolder = require("zip-folder");
const rimraf = require("rimraf");
const QRCode = require('qrcode');
const axios = require('axios');
const utf8 = require('utf8');


const homePage ='/home/ubuntu/bill-ktc-sim/backend';


server.use("/files", express.static(__dirname +'/files'));


exports.findStatementAll = async (req, res) => {
  billingService
    .findAll()
    .then((data) => {
      res.send(data);
    })

    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.findStatementByDate = async (req, res) => {
  const { startDate, endDate } = req.body;
  billingService
    .findStatementByIssueDate(startDate, endDate)
    .then((data) => {
      res.send(data);
    })

    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
  // res.send("success");
};

exports.exportStatement = async (req, res) => {
  const json = JSON.parse(req.params.data);
  const startDate = json.startDate.replaceAll("|", "/");
  const endDate = json.endDate.replaceAll("|", "/");
  const id = json.id;

  

  const dataList = await billingService
    .findStatementByInvoiceNo(id)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
  // console.log("aa" + dataList);
  var html = "";
  for (var i = 0; i < dataList.length; i++) {
    var phone = dataList[i].cust_mobile.toString().trim();
    var invoice = dataList[i].invoice_no.toString().trim();
    var accountNo = dataList[i].account_no.toString().trim().replace(/[^0-9]/g,'');
    var totalOutBalStr = Number(dataList[i].total_out_bal.toString().trim()).toFixed(2).replace(/[^0-9]/g,'');
    var scanTxtCode = '|010554612702201\\n'+accountNo+'\\n'+invoice.replace(/[^0-9]/g,'')+'\\n'+totalOutBalStr;
    var scanTxtCodeShow = '|010554612702201 '+accountNo+' '+invoice.replace(/[^0-9]/g,'')+' '+totalOutBalStr;
    var totalOutBalTxt = bahttext.bahttext(Number(dataList[i].total_out_bal.toString().trim()));
    var detailList = await billingSubService
      .fileByDateAndPhone(invoice)
      .then((data) => {
        return data;
      });

    var groupList = await billingSubService
      .fileGroupByDateAndPhone(invoice)
      .then((data) => {
        return data;
      });
    html += await ejs.renderFile(
      "./templates/pdfTemplateStatementScan.html.ejs",
      {
        rows: dataList[i],
        detail: detailList,
        group: groupList,
        totalOutBalTxt:totalOutBalTxt,
        scanTxtCode:scanTxtCode,
        scanTxtCodeShow:scanTxtCodeShow,
        chkNum:i
      },
      { async: true }
    );
  }
  var options = {childProcessOptions: { env: { OPENSSL_CONF: '/dev/null' } } ,format: "A4"};
  var file = { content: html };

  pdf.create(html, options).toStream(
    (err, stream) => {
      // res.setHeader('Content-Type', 'application/pdf')
      res.set({
            "Content-Type": "application/pdf; charset=utf-8;",
            "Content-Disposition": "attachment;filename=Statement_"+invoice+".pdf"
          })
      stream.pipe(res)
    }
  )
  
  // res.status(200).send('done');
};



exports.pdfStatementByDate = async (req, res) => {
  const uid = uuidv4();
  const json = JSON.parse(req.params.data);
  // console.log(json.startDate.replaceAll('|','/'));
  const startDate = json.startDate.replaceAll('|','/');
  const endDate = json.endDate.replaceAll('|','/');
  console.log('export to PDF form : '+startDate+' '+endDate);

  
  const dataList = await billingService.findStatementByIssueDate(startDate, endDate)
  .then((data) => {
    return data;
  })

  .catch((err) => {
    console.log(err);
    res.status(500).send(err);
  });

  var html=""
  for(var i = 0; i < dataList.length; i++){

    var phone = dataList[i].cust_mobile.toString().trim();
    var invoice = dataList[i].invoice_no.toString().trim();
    var accountNo = dataList[i].account_no.toString().trim().replace(/[^0-9]/g,'');
    var totalOutBalStr = Number(dataList[i].total_out_bal.toString().trim()).toFixed(2).replace(/[^0-9]/g,'');
    var scanTxtCode = '|010554612702201\\n'+accountNo+'\\n'+invoice.replace(/[^0-9]/g,'')+'\\n'+totalOutBalStr;
    var scanTxtCodeShow = '|010554612702201 '+accountNo+' '+invoice.replace(/[^0-9]/g,'')+' '+totalOutBalStr;
    var totalOutBalTxt = bahttext.bahttext(Number(dataList[i].total_out_bal.toString().trim()));
    
    var detailList = await billingSubService.fileByDateAndPhone(invoice)
    .then((data) => {
      return data;
    });

    var groupList = await billingSubService.fileGroupByDateAndPhone(invoice)
    .then((data) => {
      return data;
    });

    console.log(phone);
    console.log(groupList);
    html += await ejs.renderFile(
      "./templates/pdfTemplateStatementScan.html.ejs",
      {
        rows: dataList[i],
        detail : detailList,
        group : groupList,
        totalOutBalTxt:totalOutBalTxt,
        scanTxtCode:scanTxtCode,
        scanTxtCodeShow:scanTxtCodeShow,
        chkNum:i
      },
      {async :true},"utf8"
    );
  }

  var options = {childProcessOptions: { env: { OPENSSL_CONF: '/dev/null' } },format: "A4",timeout: '600000'};
  var  file = {content: html};
  pdf.create(html, options).toStream(
    (err, stream) => {
      if(err){ 
      console.log("🚀 ~ file: controller.billing.js ~ line 164 ~ exports.pdfStatementByDate= ~ err", err)
      }else{
      res.set({
            "Content-Type": "application/pdf; charset=utf-8;",
            "Content-Disposition": "attachment;filename=Statement_"+uid+".pdf"
          })
      stream.pipe(res)
      }
     
    }
  )

};



exports.zipStatementByDate = async (req, res) => {
  const uid = uuidv4();
  const filepath = "./files/zipStatement_" + uid + ".zip";
  const json = JSON.parse(req.params.data);
  // console.log(json.startDate.replaceAll('|','/'));
  const startDate = json.startDate.replaceAll("|", "/");
  const endDate = json.endDate.replaceAll("|", "/");
  const dataList = await billingService
    .findStatementByIssueDate(startDate, endDate)
    .then((data) => {
      return data;
    })

    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
  var invoiceNo = [];
  totalProcess = 0;
  lenProcess =dataList.length;
  if(dataList.length >0){
  for (var i = 0; i < dataList.length; i++) {
    var phone = dataList[i].cust_mobile.toString().trim();
    invoiceNo[i] = dataList[i].invoice_no.toString().trim();
    var accountNo = dataList[i].account_no.toString().trim().replace(/[^0-9]/g,'');
    var totalOutBalStr = Number(dataList[i].total_out_bal.toString().trim()).toFixed(2).replace(/[^0-9]/g,'');
    var scanTxtCode = '|010554612702201\\n'+accountNo+'\\n'+invoiceNo[i].replace(/[^0-9]/g,'')+'\\n'+totalOutBalStr;
    var scanTxtCodeShow = '|010554612702201 '+accountNo+' '+invoiceNo[i].replace(/[^0-9]/g,'')+' '+totalOutBalStr;
    var totalOutBalTxt = bahttext.bahttext(Number(dataList[i].total_out_bal.toString().trim()));
    var totalOutBalTxt = bahttext.bahttext(Number(dataList[i].total_out_bal.toString().trim()));
    var issue_date = dataList[i].issue_date.toString().trim().replaceAll('/', '');
    var detailList = await billingSubService
      .fileByDateAndPhone(invoiceNo[i])
      .then((data) => {
        return data;
      });

    var groupList = await billingSubService
      .fileGroupByDateAndPhone(invoiceNo[i])
      .then((data) => {
        return data;
      });

    var html = await ejs.renderFile(
      "./templates/pdfTemplateStatementScan.html.ejs",
      {
        rows: dataList[i],
        detail: detailList,
        group: groupList,
        totalOutBalTxt:totalOutBalTxt,
        scanTxtCode:scanTxtCode,
        scanTxtCodeShow:scanTxtCodeShow,
        chkNum:i
      },
      { async: true }
    );

    var options = {childProcessOptions: { env: { OPENSSL_CONF: '/dev/null' } }, format: "A4" };
    var file = { content: html };
    filename = "./files/zipStatement/"+issue_date+"/"+"Statement" + invoiceNo[i] +".pdf";
  
    // await genPDF(html, options,filename) ;
    pdf.create(html, options).toFile(filename,(err, res)=>{
          console.log(res)
          totalProcess++;
        });
  }

  while(totalProcess  < lenProcess){
    await sleep(1000);
    console.log(totalProcess);
  }
    
    zipFolder('./files/zipStatement_'+uid, filepath, function(err) {
        console.log("--------------------- zip file statement ---------------------");
        if(err) {
            console.log('err : ', err);
        } else {
            console.log('Zip Statement Done');
            rimraf("./files/zipStatement_"+uid, function () { console.log("Deleted Folder : zipStatement_"+uid); });
            res.send(filepath.replaceAll("/", "|"));
            
        }
    });
  
  
}else{
  res.send("Data is null");
}
};



exports.downloadStatementFileByPath = async (req, res) => {
  console.log("download");
  const json = JSON.parse(req.params.pathdata);
  const path = json.path.replaceAll("|", "/");
  
  try {
    res.download(path, function(err) {
      if (err) {
        console.log(err); // Check error if you want
      }
      fs.unlink(path, function(){
          console.log("File was deleted") // Callback
      });
    
    });

    //file removed
  } catch (err) {
    console.error(err);
  }
};




exports.readStatementExcelFile = async (req, res) => {
  const logNumber = uuidv4();

  var today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' +yyyy + ' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
  
  var file = req.files.excelfile
  const fileName = utf8.decode(file.name.toString())  ;

  var wb= xlsx.read(file.data, {type: "buffer"});
  const ws1 = wb.Sheets[wb.SheetNames[0]];
  const excelRows = xlsx.utils.sheet_to_json(ws1).length;
  console.log(excelRows);
  if(excelRows >= 1 ){
  var cust_name =null;
  var cust_add =null;
  var cust_id =null;
  var account_no =null;
  var invoice_no =null;
  var issue_date =null;
  var tax_id =null;
  var cust_mobile =null;
  var bill_cycle_start =null;
  var expresstion =null;
  var bill_cycle_end =null;
  var over_fee =null;
  var special_number_fee =null;
  var supple_promotion =null;
  var sms =null;
  var mms =null;
  var oversea =null;
  var roaming =null;
  var other =null;
  var sum_over_package =null;
  var out_bal =null;
  var total_out_bal =null;
  var paid_amount =null;
  var vat =null;
  var amount =null;
  var current_due_date = null;
  var account_number =null;
  var cut_date =null;
  var hide_digit =null;

  var insertData =[];
  for (var i = 2; i <= excelRows+1; i++) {
    if(ws1['A'+i] != null )
    cust_name   = ws1['A'+i].w.toString().trim() ;
    else
    cust_name = '';
    if(ws1['B'+i] != null )
    cust_add    =ws1['B'+i].w.toString().trim() ;
    else
    cust_add = '';
    if(ws1['C'+i] != null )
    cust_id     =ws1['C'+i].w.toString().trim() ;
    else
    cust_id ='';
    if(ws1['D'+i] != null )
    account_no  =ws1['D'+i].w.toString().trim() ;
    else
    account_no = '';
    if(ws1['E'+i] != null )
    invoice_no  =ws1['E'+i].w.toString().trim() ;
    if(ws1['F'+i] != null )
    issue_date  =ws1['F'+i].w.toString().trim() ;
    if(ws1['G'+i] != null )
    tax_id      =ws1['G'+i].w.toString().trim() ;
    if(ws1['H'+i] != null )
    cust_mobile =ws1['H'+i].w.toString().trim() ;
    if(ws1['I'+i] != null )
    bill_cycle_start  =ws1['I'+i].w.toString().trim() ;
    if(ws1['J'+i] != null )
    expresstion       =ws1['J'+i].w.toString().trim() ;
    if(ws1['K'+i] != null )
    bill_cycle_end    =ws1['K'+i].w.toString().trim() ;
    if(ws1['L'+i] != null )
    over_fee          =ws1['L'+i].v.toString().trim() ;
    else 
    over_fee = '0';
    if(ws1['M'+i] != null )
    special_number_fee =ws1['M'+i].v.toString().trim() ;
    else 
    special_number_fee = '0';
    if(ws1['N'+i] != null )
    supple_promotion =ws1['N'+i].v.toString().trim() ;
    else 
    supple_promotion = '0';
    if(ws1['O'+i] != null )
    sms =ws1['O'+i].v.toString().trim() ;
    else 
    sms = '0';
    if(ws1['P'+i] != null )
    mms =ws1['P'+i].v.toString().trim() ;
    else
    mms = '0';
    if(ws1['Q'+i] != null )
    oversea =ws1['Q'+i].v.toString().trim() ;
    else 
    oversea = '0';
    if(ws1['R'+i] != null )
    roaming =ws1['R'+i].v.toString().trim() ;
    else
    roaming = '0';
    if(ws1['S'+i] != null )
    other =ws1['S'+i].v.toString().trim() ;
    else
    other = '0';
    if(ws1['T'+i] != null )
    sum_over_package =ws1['T'+i].v.toString().trim() ;
    else
    sum_over_package = '0';
    if(ws1['U'+i] != null )
    out_bal =ws1['U'+i].v.toString().trim() ;
    else
    out_bal ='0';
    if(ws1['V'+i] != null )
    total_out_bal =ws1['V'+i].v.toString().trim() ;
    else total_out_bal = '0';
    if(ws1['W'+i] != null )
    paid_amount =ws1['W'+i].v.toString().trim() ;
    else vat = '0';
    if(ws1['X'+i] != null )
    vat =ws1['X'+i].v.toString().trim() ;
    else vat = '0';
    if(ws1['Y'+i] != null )
    amount =ws1['Y'+i].v.toString().trim() ;
    else amount= '0';
    if(ws1['Z'+i] != null )
    current_due_date =ws1['Z'+i].w.toString().trim() ;
    else current_due_date= '';
    if(ws1['AA'+i] != null )
    account_number =ws1['AA'+i].w.toString().trim() ;
    else account_number= '';
    if(ws1['AB'+i] != null )
    cut_date =ws1['AB'+i].w.toString().trim() ;
    else cut_date= '';
    if(ws1['AC'+i] != null )
    hide_digit =ws1['AC'+i].w.toString().trim() ;
    else hide_digit= '';

    var dataList = {
      cust_name :cust_name,
      cust_add :cust_add,
      cust_id :cust_id,
      account_no :account_no,
      invoice_no :invoice_no,
      issue_date :issue_date,
      tax_id :tax_id,
      cust_mobile :cust_mobile,
      bill_cycle_start :bill_cycle_start,
      expresstion :expresstion,
      bill_cycle_end :bill_cycle_end,
      over_fee :over_fee,
      special_number_fee :special_number_fee,
      supple_promotion :supple_promotion,
      sms :sms,
      mms : mms,
      oversea : oversea,
      roaming :roaming,
      other : other,
      sum_over_package : sum_over_package,
      out_bal : out_bal,
      total_out_bal : total_out_bal,
      paid_amount : paid_amount,
      vat : vat,
      amount : amount,
      current_due_date : current_due_date,
      account_number : account_number,
      cut_date : cut_date,
      hide_digit : hide_digit,
      log_number:logNumber
    }
    console.log(dataList)
    insertData.push(dataList);
  
  }
  console.log(`this data insert : ${insertData}`)
  billingService.multiCreate(insertData)
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  

  const ws2 = wb.Sheets[wb.SheetNames[1]];
  const excelRows2 = xlsx.utils.sheet_to_json(ws2).length;
  var sub_invoice_no = null;
  var sub_origin_number =null;
  var sub_call_date =null;
  var sub_call_time = null;
  var sub_destination_number =null;
  var sub_util =null;
  var sub_service_charge_id =null;
  var sub_service_charge_name =null;
  var sub_service_charge_amt =null;
  var sub_sum_over_package =null;
  var sub_out_bal =null;
  var sub_total_out_bal = null;

  var insertData2 =[];
  for (var i = 2; i <= excelRows2+1; i++) {
    if(ws2['A'+i] != null )
    sub_invoice_no   = ws2['A'+i].w.toString().trim() ;
    else
    sub_invoice_no = '';
    if(ws2['B'+i] != null )
    sub_origin_number   = ws2['B'+i].w.toString().trim() ;
    else
    sub_origin_number = '';
    if(ws2['C'+i] != null )
    sub_call_date   = ws2['C'+i].w.toString().trim() ;
    else
    sub_call_date = '';
    if(ws2['D'+i] != null )
    sub_call_time   = ws2['D'+i].w.toString().trim() ;
    else
    sub_call_time = '';
    if(ws2['E'+i] != null )
    sub_destination_number   = ws2['E'+i].w.toString().trim() ;
    else
    sub_destination_number = '';
    if(ws2['F'+i] != null )
    sub_util   = ws2['F'+i].w.toString().trim() ;
    else
    sub_util = '';
    if(ws2['G'+i] != null )
    sub_service_charge_id   = ws2['G'+i].w.toString().trim() ;
    else
    sub_service_charge_id = '';
    if(ws2['H'+i] != null )
    sub_service_charge_name   = ws2['H'+i].w.toString().trim() ;
    else
    sub_service_charge_name = '';
    if(ws2['I'+i] != null )
    sub_service_charge_amt   = Number(ws2['I'+i].v.toString().trim()).toFixed(2) ;
    else
    sub_service_charge_amt = '0';
    if(ws2['J'+i] != null )
    sub_sum_over_package   = Number(ws2['J'+i].v.toString().trim()).toFixed(2) ;
    else
    sub_sum_over_package = '';
    if(ws2['K'+i] != null )
    sub_out_bal   =Number(ws2['K'+i].v.toString().trim()).toFixed(2) ;
    else
    sub_out_bal = '';
    if(ws2['L'+i] != null )
    sub_total_out_bal   = Number(ws2['L'+i].v.toString().trim()).toFixed(2) ;
    else
    sub_total_out_bal = '';

    var dataList2 = {
      invoice_no  : sub_invoice_no ,
      origin_number : sub_origin_number,
      call_date : sub_call_date,
      call_time  : sub_call_time ,
      destination_number : sub_destination_number,
      unit : sub_util,
      service_charge_id : sub_service_charge_id,
      service_charge_name : sub_service_charge_name,
      service_charge_amt : sub_service_charge_amt,
      sum_over_package : sub_sum_over_package,
      out_bal : sub_out_bal,
      total_out_bal  : sub_total_out_bal 
    }
    // console.log(sub_call_time)
    insertData2.push(dataList2);

  }
  console.log(`this data insert : ${insertData2}`)
  billingSubService.multiCreate(insertData2)
      .then(async () =>{  
        var dataLog = {
          file_name :fileName,
          upload_date :today,
          log_number :logNumber,
          file_type_id : "1",
          file_type_name : "Statement",
          log_type_id : "1",
          log_type_name : "Active",
          file_created_status : false,
          
        }
      
        await uploadLogService.create(dataLog)
        // .then((data) => res.status(200).send("success"))
        .catch((err) => {
          console.log(err);
          res.status(500).send(err);
        });
        await exportStatementToPatch();
        await updateUploadLogCreated();
        res.status(200).send("success")
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  
  
  
  
  }else{
    console.log("Data not found");
    res.send("Data not found");
  }
}





//Invoices 
exports.findInvoiceByDate = async (req, res) => {
  const { startDate, endDate } = req.body;
  invoiceService
    .findInvoiceByIssueDate(startDate, endDate)
    .then((data) => {
      res.send(data);
    })

    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
  // res.send("success");
};

exports.exportInvoice = async (req, res) => {
  const json = JSON.parse(req.params.data);
  const startDate = json.startDate.replaceAll("|", "/");
  const endDate = json.endDate.replaceAll("|", "/");
  const id = json.id;

  var date_ob = new Date();
  var date = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();
  
  var nowDate = date+"/"+month+"/"+(year);
  const dataList = await invoiceService.findInvoiceByInvoiceNo(id)
  .then((data) => {
    return data;
  })

  .catch((err) => {
    console.log(err);
    res.status(500).send(err);
  });
console.log(dataList)
  for(var i = 0; i < dataList.length; i++){
    feeAmt = (Math.round((dataList[i].vat)*100)/100);
    allAmt = Number(Math.round((dataList[i].amount)*100)/100).toFixed(2);
    bathText = bahttext.bahttext(allAmt) ;

    var html = await ejs.renderFile(
      "./templates/pdfTemplateInvoice.html.ejs",
      {
        rows: dataList[i],
        nowDate : nowDate,
        feeAmt:feeAmt,
        allAmt:allAmt,
        bathText:bathText,
      },
      {async :true},"utf8"
    );
  }
  // html ="`<html><body>Test</body></html>"
  // console.log("start ----------->")
  var options = {
    childProcessOptions: { env: { OPENSSL_CONF: '/dev/null' } } ,
    format: "A4",
  };
  // console.log("start ----------->")
  pdf.create(html, options).toStream(
    (err, stream) => {
      if(err){
        console.log("err : "+ err);
        return err;
      }
      // console.log("stream : "+ stream)
      // res.setHeader('Content-Type', 'application/pdf')
      res.set({
            "Content-Type": "application/pdf; charset=utf-8;",
            "Content-Disposition": "attachment;filename=Invoice_"+id+".pdf"
          })
      stream.pipe(res)
    }
  )
};

exports.pdfInvoiceByDate = async (req, res) => {
  // const nowDate = Date.now();
  var date_ob = new Date();
  var date = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();
  
  var nowDate = date+"/"+month+"/"+(year);
  const json = JSON.parse(req.params.data);
  // console.log(json.startDate.replaceAll('|','/'));
  const startDate = json.startDate.replaceAll('|','/');
  const endDate = json.endDate.replaceAll('|','/');
  console.log('export to PDF form : '+startDate+' '+endDate);

  var bathText = '';
  var feeAmt =0;
  var allAmt =0;
  const dataList = await invoiceService.findInvoiceByIssueDate(startDate, endDate)
  .then((data) => {
    return data;
  })

  .catch((err) => {
    console.log(err);
    res.status(500).send(err);
  });
console.log(dataList)
  var html=""
  for(var i = 0; i < dataList.length; i++){
    feeAmt = (Math.round((dataList[i].vat)*100)/100);
    allAmt = Number(Math.round((dataList[i].amount)*100)/100).toFixed(2);
    bathText = bahttext.bahttext(allAmt) ;

    html += await ejs.renderFile(
      "./templates/pdfTemplateInvoice.html.ejs",
      {
        rows: dataList[i],
        nowDate : nowDate,
        feeAmt:feeAmt,
        allAmt:allAmt,
        bathText:bathText,
      },
      {async :true},"utf8"
    );
  }

  var options = {childProcessOptions: { env: { OPENSSL_CONF: '/dev/null' } },format: "A4"};
  var  file = {content: html};
  pdf.create(html, options).toStream(
    (err, stream) => {
      // res.setHeader('Content-Type', 'application/pdf')
      res.set({
            "Content-Type": "application/pdf; charset=utf-8;",
            "Content-Disposition": "attachment;filename=Invoice_"+startDate+"-"+endDate+".pdf"
          })
      stream.pipe(res)
    }
  )

};
 exports.zipInvoiceByDate = async (req, res) => {
  const uid = uuidv4();
  const filepath = "./files/zipInvoice_" + uid + ".zip";
  // const nowDate = Date.now();
  var date_ob = new Date();
  var date = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();
  
  var filename = [];
  var invoiceNo = [];
  var taxInvoiceNo = [];
  var nowDate = date+"/"+month+"/"+(year);
  const json = JSON.parse(req.params.data);
  // console.log(json.startDate.replaceAll('|','/'));
  const startDate = json.startDate.replaceAll('|','/');
  const endDate = json.endDate.replaceAll('|','/');
  console.log('export to PDF form : '+startDate+' '+endDate);

  var bathText = '';
  var feeAmt =0;
  var allAmt =0;
  const dataList = await invoiceService.findInvoiceByIssueDate(startDate, endDate)
  .then((data) => {
    return data;
  })

  .catch((err) => {
    console.log(err);
    res.status(500).send(err);
  });
  var html=""
  var totalProcess = 0;
  var lenProcess = dataList.length
  if(dataList.length > 0){
    for(var i = 0; i < dataList.length; i++){
      invoiceNo[i] = dataList[i].invoice_no;
      taxInvoiceNo[i] = dataList[i].tax_invoice_no;
      feeAmt = (Math.round((dataList[i].vat)*100)/100);
      allAmt = Number(Math.round((dataList[i].amount)*100)/100).toFixed(2);
      bathText = bahttext.bahttext(allAmt) ;
  
      html = await ejs.renderFile(
        "./templates/pdfTemplateInvoice.html.ejs",
        {
          rows: dataList[i],
          nowDate : nowDate,
          feeAmt:feeAmt,
          allAmt:allAmt,
          bathText:bathText,
        },
        {async :true},"utf8"
      );
  
    var options = {childProcessOptions: { env: { OPENSSL_CONF: '/dev/null' } },format: "A4"};
    filename = "./files/zipInvoice_"+uid+"/"+"Invoice" + taxInvoiceNo[i] +".pdf";
    // console.log(i);
  
    // await genPDF(html, options,filename) ;
    pdf.create(html, options).toFile(filename,(err, res)=>{
          console.log(res)
          totalProcess++;
        });
        
    }
    
      
    while(totalProcess  < lenProcess){
      // setTimeout(() => {  console.log("World!"); }, 2000);
      await sleep(1000);
    }
      
    zipFolder('./files/zipInvoice_'+uid, filepath, function(err) {
      console.log("--------------------- zip file invoice ---------------------");
        if(err) {
            console.log('oh no!', err);
        } else {
            console.log('Zip Invoice Done');
            rimraf("./files/zipInvoice_"+uid, function () { console.log("Deleted Folder : zipInvoice_"+uid); });
            res.send(filepath.replaceAll("/", "|"));
            
        }
    });
  }else{
    res.send("Data is null");
  }

};

exports.downloadInvoiceFileByPath = async (req, res) => {
  console.log("download");
  const json = JSON.parse(req.params.pathdata);
  console.log(json)
  const path = json.path.replaceAll("|", "/");
  try {
    fs.accessSync(path);
    console.log("exists:", path);
  } catch (err) {
    console.log("DOES NOT exist:", path);
    console.error(err);
  }
  try {
    
    
    res.download(path, function(err) {
      if (err) {
        console.log(err); // Check error if you want
      }
      fs.unlink(path, function(){
          console.log("File was deleted") // Callback
      });
    
    });
    

    //file removed
  } catch (err) {
    console.error(err);
  }
};






exports.readInvoiceExcelFile = async (req, res) => {
  const logNumber = uuidv4();
  // console.log("aaa")
  var today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' +yyyy + ' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
  console.log(today);
  var file = req.files.excelfile
  const fileName = utf8.decode(file.name.toString())  ;
  var wb= xlsx.read(file.data, {type: "buffer"});
  const wsname = wb.SheetNames[0];
  const ws = wb.Sheets[wsname];
  const excelRows = xlsx.utils.sheet_to_json(ws).length;
  if(excelRows >= 1 ){
  // console.log(ws['A1'].v);
  var cust_name =null;
  var cust_add =null;
  var cust_id =null;
  var account_no =null;
  var tax_invoice_no =null;
  var invoice_no =null;
  var issue_date =null;
  var tax_id =null;
  var cust_mobile =null;
  var bill_cycle_start =null;
  var expresstion =null;
  var bill_cycle_end =null;
  var over_fee =null;
  var special_number_fee =null;
  var supple_promotion =null;
  var sms =null;
  var mms =null;
  var oversea =null;
  var roaming =null;
  var other =null;
  var sum_over_package =null;
  var out_bal =null;
  var total_out_bal =null;
  var vat =null;
  var amount =null;

  var insertData =[];
  for (var i = 2; i <= excelRows+1; i++) {
    if(ws['A'+i] != null )
    cust_name   = ws['A'+i].w.toString().trim() ;
    else
    cust_name = '';
    if(ws['B'+i] != null )
    cust_add    =ws['B'+i].w.toString().trim() ;
    else
    cust_add = '';
    if(ws['C'+i] != null )
    cust_id     =ws['C'+i].w.toString().trim() ;
    else
    cust_id ='';
    if(ws['D'+i] != null )
    account_no  =ws['D'+i].w.toString().trim() ;
    else
    account_no = '';
    if(ws['E'+i] != null )
    tax_invoice_no =ws['E'+i].w.toString().trim() ;
    if(ws['F'+i] != null )
    invoice_no  =ws['F'+i].w.toString().trim() ;
    if(ws['G'+i] != null )
    issue_date  =ws['G'+i].w.toString().trim() ;
    if(ws['H'+i] != null )
    tax_id      =ws['H'+i].w.toString().trim() ;
    if(ws['I'+i] != null )
    cust_mobile =ws['I'+i].w.toString().trim() ;
    if(ws['J'+i] != null )
    bill_cycle_start  =ws['J'+i].w.toString().trim() ;
    if(ws['K'+i] != null )
    expresstion       =ws['K'+i].w.toString().trim() ;
    if(ws['L'+i] != null )
    bill_cycle_end    =ws['L'+i].w.toString().trim() ;
    if(ws['M'+i] != null )
    over_fee          =ws['M'+i].v.toString().trim() ;
    else 
    over_fee = '0';
    if(ws['N'+i] != null )
    special_number_fee =ws['N'+i].v.toString().trim() ;
    else 
    special_number_fee = '0';
    if(ws['O'+i] != null )
    supple_promotion =ws['O'+i].v.toString().trim() ;
    else 
    supple_promotion = '0';
    if(ws['P'+i] != null )
    sms =ws['P'+i].v.toString().trim() ;
    else 
    sms = '0';
    if(ws['Q'+i] != null )
    mms =ws['Q'+i].v.toString().trim() ;
    else
    mms = '0';
    if(ws['R'+i] != null )
    oversea =ws['R'+i].v.toString().trim() ;
    else 
    oversea = '0';
    if(ws['S'+i] != null )
    roaming =ws['S'+i].v.toString().trim() ;
    else
    roaming = '0';
    if(ws['T'+i] != null )
    other =ws['T'+i].v.toString().trim() ;
    else
    other = '0';
    if(ws['U'+i] != null )
    sum_over_package =ws['U'+i].v.toString().trim() ;
    else
    sum_over_package = '0';
    if(ws['V'+i] != null )
    out_bal =ws['V'+i].v.toString().trim() ;
    else
    out_bal ='0';
    if(ws['W'+i] != null )
    total_out_bal =ws['W'+i].v.toString().trim() ;
    else total_out_bal = '0';
    if(ws['X'+i] != null )
    vat =ws['X'+i].v.toString().trim() ;
    else vat = '0';
    if(ws['Y'+i] != null )
    amount =ws['Y'+i].v.toString().trim() ;
    else amount= '0';
    // console.log(amount)
    var dataList = {
      cust_name :cust_name,
      cust_add :cust_add,
      cust_id :cust_id,
      account_no :account_no,
      tax_invoice_no :tax_invoice_no,
      invoice_no :invoice_no,
      issue_date :issue_date,
      tax_id :tax_id,
      cust_mobile :cust_mobile,
      bill_cycle_start :bill_cycle_start,
      expresstion :expresstion,
      bill_cycle_end :bill_cycle_end,
      over_fee :over_fee,
      special_number_fee :special_number_fee,
      supple_promotion :supple_promotion,
      sms :sms,
      mms : mms,
      oversea : oversea,
      roaming :roaming,
      other : other,
      sum_over_package : sum_over_package,
      out_bal : out_bal,
      total_out_bal : total_out_bal,
      vat : vat,
      amount : amount,
      log_number :logNumber,
    }
    insertData.push(dataList);
  
  }
  console.log(`this data insert : ${insertData}`)
  invoiceService.multiCreate(insertData)
      .then(async () => {  
        var dataLog = {
          file_name :fileName,
          upload_date :today,
          log_number :logNumber,
          file_type_id : "2",
          file_type_name : "Invoice",
          log_type_id : "1",
          log_type_name : "Active",
          file_created_status : false,
          
        }
        await uploadLogService.create(dataLog)
        .catch((err) => {
          console.log(err);
          res.status(500).send(err);
        });
        await exportInvoiceToPatch();
        await updateUploadLogCreated();
        res.status(200).send("success");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });

  

  }else{
    console.log("Data not found");
    res.send("Data not found");
  }
  res.send("Data not found");
};





//Function
// function getBuffer(file, options) {
//   var buffer = htmlToPdf
//     .generatePdf(file, options)
//     .then((pdfBuffer) => {
//       console.log(pdfBuffer);
//       return pdfBuffer;
//     })
//     .catch((err) => {
//       res.send({ success: false, err: err });
//     });
//   return buffer;
// }

const genPDF = async () =>{
  await pdf.create(html, options).toFile(filename,(err, res)=>{
    console.log(res)
  });
  
}
// async function genPDF(html, options,filename) {
// pdf.create(html, options).toFile(filename,(err, res)=>{
//     console.log(res)
    
//   });
// }

async function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}



//Upload Log
exports.findUploadLog = async (req, res) => {
  // console.log(req.params.data)
  const type = req.params.data;
  uploadLogService
    .findByType(type)
    .then((data) => {
      // console.log(data)
      res.send(data);
    })

    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
  // res.send("success");
};

const exportStatementToPatch = async () => {
  const dataList = await billingService.findNotImportStatement();
  console.log("Statement must Export File : "+dataList.length);
  if(dataList.length >0 ){
    console.log('------------------ Start Export Statement ------------------');
    const uid = uuidv4();
    const filepath = "./files/zipStatement_" + uid + ".zip";
    
    var invoiceNo = [];
    totalProcess = 0;
    lenProcess =dataList.length;
    for (var i = 0; i < dataList.length; i++) {
      let id =dataList[i].id
      var phone = dataList[i].cust_mobile.toString().trim();
      invoiceNo[i] = dataList[i].invoice_no.toString().trim();
      var accountNo = dataList[i].account_no.toString().trim();
      var logNumber = dataList[i].log_number.toString().trim();
      var totalOutBalStr = Number(dataList[i].total_out_bal.toString().trim()).toFixed(2).replace(/[^0-9]/g,'');
      var scanTxtCode = '|010554612702201\\n'+accountNo+'\\n'+invoiceNo[i].replace(/[^0-9]/g,'')+'\\n'+totalOutBalStr;
      var scanTxtCodeShow = '|010554612702201 '+accountNo+' '+invoiceNo[i].replace(/[^0-9]/g,'')+' '+totalOutBalStr;
      var totalOutBalTxt = bahttext.bahttext(Number(dataList[i].total_out_bal.toString().trim()));
      var totalOutBalTxt = bahttext.bahttext(Number(dataList[i].total_out_bal.toString().trim()));
      var issue_date = dataList[i].issue_date.toString().trim().replaceAll('/', '');
      var detailList = await billingSubService
        .fileByDateAndPhone(invoiceNo[i])
        .then((data) => {
          return data;
        });
  
      var groupList = await billingSubService
        .fileGroupByDateAndPhone(invoiceNo[i])
        .then((data) => {
          return data;
        });
  
      var html = await ejs.renderFile(
        "./templates/pdfTemplateStatementScan.html.ejs",
        {
          rows: dataList[i],
          detail: detailList,
          group: groupList,
          totalOutBalTxt:totalOutBalTxt,
          scanTxtCode:scanTxtCode,
          scanTxtCodeShow:scanTxtCodeShow,
          chkNum:i
        },
        { async: true }
      );
  
      var options = { childProcessOptions: { env: { OPENSSL_CONF: '/dev/null' } },format: "A4" };
      var file = { content: html };
      filename = "./files/statement/"+logNumber+"/"+accountNo+"/"+"Statement" + invoiceNo[i] +".pdf";
    
      // await genPDF(html, options,filename) ;
      pdf.create(html, options).toFile(filename,(err, res)=>{
        if(err){
          console.log("can't create file : "+ err)
        }
        else{
          console.log("create file : " + filename)
          let reference_number = "invoice"+uuidv4(); 
          totalProcess++;
          const dataUpdate ={file_status_id : '1' ,file_status_name:'Created',reference_number:reference_number};
          billingService.update(id,dataUpdate)
            // .then((data) => res.send(data))
            .catch((err) => {
                     console.log(err);
                     res.status(500).send(err);
                   });
        }
            
          });
    }
  
    while(totalProcess  < lenProcess){
      await sleep(1000);
      console.log(totalProcess);
    }

    console.log('------------------ End Export Statement ------------------')
  }
};


 
const exportInvoiceToPatch = async () => {
  const dataList = await invoiceService.findNotImportInvoice();
  console.log("data : "+dataList.length);
  if(dataList.length >0 ){
    console.log('------------------ Start Export Invoice ------------------');
  // const nowDate = Date.now();
  var date_ob = new Date();
  var date = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();
  
  var filename = [];
  var invoiceNo = [];

  var nowDate = date+"/"+month+"/"+(year);

  var bathText = '';
  var feeAmt =0;
  var allAmt =0;
  
  var html=""
  var totalProcess = 0;
  var lenProcess = dataList.length
    for(var i = 0; i < dataList.length; i++){
      invoiceNo[i] = dataList[i].invoice_no;
      let id =dataList[i].id;
      var accountNo = dataList[i].account_no.toString().trim();
      let logNumber =dataList[i].log_number.toString().trim()
      feeAmt = (Math.round((dataList[i].vat)*100)/100);
      allAmt = Number(Math.round((dataList[i].amount)*100)/100).toFixed(2);
      bathText = bahttext.bahttext(allAmt) ;
  
      html = await ejs.renderFile(
        "./templates/pdfTemplateInvoice.html.ejs",
        {
          rows: dataList[i],
          nowDate : nowDate,
          feeAmt:feeAmt,
          allAmt:allAmt,
          bathText:bathText,
        },
        {async :true},"utf8"
      );
  
    var options = {childProcessOptions: { env: { OPENSSL_CONF: '/dev/null' } },format: "A4"};
    filename = "./files/invoice/"+logNumber+"/"+accountNo+"/"+"Invoice_" + invoiceNo[i] +".pdf";
    // console.log(i);
  
    // await genPDF(html, options,filename) ;
     pdf.create(html, options).toFile(filename,(err, res)=>{
          if(err){
            console.log("can't create file : "+ err)
          }
          else{
            console.log("create file : " + filename)
            let reference_number = "invoice"+uuidv4(); 
          totalProcess++;
            const dataUpdate ={file_status_id : '1' ,file_status_name:'Created',reference_number: reference_number};
             invoiceService.update(id,dataUpdate)
              // .then((data) => res.send(data))
              .catch((err) => {
                       console.log(err);
                       res.status(500).send(err);
                     });
          }
        });
       
    }


    while(totalProcess  < lenProcess){
      // setTimeout(() => {  console.log("World!"); }, 2000);
      await sleep(1000);
    }
    console.log('------------------ End Export Invoice ------------------');
  }

};

const updateUploadLogCreated = async (req, res) => {
  uploadLogService.updateByCreateFile({file_created_status : true});
  

};

exports.deleteUpload = async (req, res) => {
  console.log(req.body.log_number);
  const logNumber = req.body.log_number;
  const fileTypeId = req.body.file_type_id;
  if(fileTypeId == '1'){
    billingService.deleteByLogNumber(logNumber)
       .catch((err) => {
         console.log(err);
         res.status(500).send(err);
       });
    billingSubService.deleteByLogNumber(logNumber)
       .catch((err) => {
         console.log(err);
         res.status(500).send(err);
       });
    rimraf("./files/statement/"+logNumber, function () { console.log("Deleted file by log : "+logNumber); });
  }else if(fileTypeId == '2'){
    
    invoiceService.deleteByLogNumber(logNumber)
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
    rimraf("./files/invoice/"+logNumber, function () { console.log("Deleted file by log : "+logNumber); });
  }
    
  const dataUpdate ={log_type_id : '2' ,log_type_name:'Deleted'};
    uploadLogService.updateByLogNumber(logNumber,dataUpdate)
    // .then((data) => res.send(data))
    .catch((err) => {
             console.log(err);
             res.status(500).send(err);
           });
  res.send("success");
};


exports.sendSmsByLog = async (req, res) => {
  const logNumber = req.body.log_number;
  const fileTypeId = req.body.file_type_id;
  let phones =[]
 
  if(fileTypeId == '1'){
   console.log("send sms statement");
   const statementList = await billingService.findStatementByLog(logNumber).then((data) => {return data;})
   if(statementList.length >0){
    for(let i = 0; i < statementList.length; i++){
      // console.log(statementList[i].cust_mobile)
      phones.push({
        phone : "0846278613",
        mess : "KTC Invoice : http://localhost:3000/files/statement/"+statementList[i].reference_number
      })
    }
  }
  }else if(fileTypeId == '2'){
    console.log("send sms invoice");
    const invoiceList = await invoiceService
   .findInvoiceByLog(logNumber)
   .then((data) => {
     return data;
   })
   if(invoiceList.length >0){
     for(let i = 0; i < invoiceList.length; i++){
      phones.push({
        phone : "0846278613",
        mess : "KTC Invoice : http://localhost:3000/files/invoice/"+invoiceList[i].reference_number
      })
     }
   }
  }
  // Start Axios
    var userSend = JSON.stringify({
      username:"dsms",password: "dsms1234"
    });
    var dataSMS = JSON.stringify({
      account: "OSD",
      sender: "KONDEE",
      phones: phones,
    });
    console.log(dataSMS);
    
    const options = {
      method: "post",
      url: "http://192.168.102.168:8080/authenticate",
      headers: {
        "Content-Type": "application/json",
      },
      data: userSend,
    };
    axios(options)
      .then(function (response) {
        const result = JSON.stringify(response.data);
        if (result) {
          var dataSMS = JSON.stringify({
            account: "OSD",
            sender: "KONDEE",
            phones: phones,
          });
          console.log(dataSMS);
          const SendSMS = {
            method: "post",
            url: "http://192.168.102.168:8080/send",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer" + result,
            },
            data: dataSMS,
          };
          axios(SendSMS)
            .then(function (response) {
              console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          return "Error";
        }
        // console.log();
      })
      .catch(function (error) {
        console.log(error);
      });
  //End Axios

  const dataUpdate ={file_created_status : '2' };
    uploadLogService.updateByLogNumber(logNumber,dataUpdate)
    // .then((data) => res.send(data))
    .catch((err) => {
             console.log(err);
             res.status(500).send(err);
           });
  res.send("success");
};

exports.downloadFileBySmsCus = async (req, res) => {
  
  if(req.params.type == 'statement'){
    let detail ={reference_number : req.params.refNumber}
    const statement = await billingService.findOneAny(detail).then((data) => {return data;});
    const file = `${homePage}/files/statement/`+statement[0].log_number+`/`+statement[0].account_no+`/Invoice_`+statement[0].invoice_no+`.pdf`;
    // res.download(file);
    let stream = fs.createReadStream(file);
    let stat = fs.statSync(file);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Invoice_'+statement[0].invoice_no+'.pdf');
    stream.pipe(res);
  }else if(req.params.type == 'invoice'){
    let detail ={reference_number : req.params.refNumber}
    const invoice = await invoiceService.findOneAny(detail).then((data) => {return data;});
    const file = `${homePage}/files/invoice/`+invoice[0].log_number+`/`+invoice[0].account_no+`/Invoice_`+invoice[0].invoice_no+`.pdf`;
    // const path = `${__dirname}/files/img.jpeg`; 
    // const filePath = fs.createWriteStream(file);
    
    let stream = fs.createReadStream(file);
    let stat = fs.statSync(file);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Invoice_'+invoice[0].invoice_no+'.pdf');
    stream.pipe(res);
    // res.download(file);
  }
  // res.send("Success");
}