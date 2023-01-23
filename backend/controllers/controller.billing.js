const express = require("express");
const Promise = require("bluebird");
const server = express();
const billingService = require("../services/services.billing");
const billingSubService = require("../services/services.billingSub");
const invoiceService = require("../services/services.invoice");
const uploadLogService = require("../services/services.uploadLog");
const { v4: uuidv4 } = require("uuid");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const JSZip = require("jszip");
const bahttext = require("bahttext");
const pdf = Promise.promisifyAll(require("html-pdf"));
const pdfToZip = Promise.promisify(require("html-pdf").create);
// const htmlToPdf = require("html-pdf-node");
const xlsx = require("xlsx");
const ejs = require("ejs");
const { ConsoleMessage } = require("puppeteer");
const zipFolder = require("zip-folder");
const rimraf = require("rimraf");
const QRCode = require("qrcode");
const axios = require("axios");
const utf8 = require("utf8");

const homePage = "/home/ubuntu/bill-ktc-sim/Files";
// const homePage = "/Users/mac-chareef/OSD/Program/files";
// /Users/mac-chareef/OSD/Program/files

server.use("/files", express.static(__dirname + "/files"));
//Statement
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
  // console.log('boddsdydyyy',req);
  const { startDate, endDate, template } = req.body;
  console.log("-----------------------------++++++"+template+"----------------------------");
  billingService
    .findStatementByIssueDate(startDate, endDate, template)
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
  console.log("-----------------------");
  console.log(json.template);
  console.log("-----------------------");
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
  console.log(dataList.length+"--------------------");
  var html = "";
  for (var i = 0; i < dataList.length; i++) {
    var phone = dataList[i].cust_mobile.toString().trim();
    var invoice = dataList[i].invoice_no.toString().trim();
    var accountNo = dataList[i].account_no.toString().trim().replace(/[^0-9]/g, "");
    var totalOutBalStr = Number(dataList[i].total_out_bal.toString().trim()).toFixed(2).replace(/[^0-9]/g, "");
    var scanTxtCode ="|010554612702201\\n" +accountNo +"\\n" +invoice.replace(/[^0-9]/g, "") +"\\n" +totalOutBalStr;
    var scanTxtCodeShow ="|010554612702201 " +accountNo +" " +invoice.replace(/[^0-9]/g, "") +" " +totalOutBalStr;
    var totalOutBalTxt = bahttext.bahttext( Number(dataList[i].total_out_bal.toString().trim()));
    var accountNumber = dataList[i].account_number.toString();
    var templates = "";
    console.log("---------------------");
    console.log(scanTxtCode);
    console.log("---------------------");
    if(json.template === "KTC"){
      // if (accountNumber != "") {
      //   templates = "./templates/pdfTemplateStatementBank.html.ejs";
      // } else {
        templates = "./templates/pdfTemplateStatementScan.html.ejs";
      // }
    }else if (json.template === "KONDEE") {
          templates = "./templates/pdfTemplateStatementScanNew.html.ejs";
    }
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
      templates,
      {
        rows: dataList[i],
        detail: detailList,
        group: groupList,
        totalOutBalTxt: totalOutBalTxt,
        scanTxtCode: scanTxtCode,
        scanTxtCodeShow: scanTxtCodeShow,
        chkNum: i,
      },
      { async: true }
    );
  }

  var options = {
    childProcessOptions: { env: { OPENSSL_CONF: "/dev/null" } },
    format: "A4",
    timeout: "5000"
  };
  var file = { content: html };

  pdf.create(html, options).toStream((err, stream) => {
    // res.setHeader('Content-Type', 'application/pdf')
    res.set({
      "Content-Type": "application/pdf; charset=utf-8;",
      "Content-Disposition":
        "attachment;filename=Invoice" + invoice + ".pdf",
    });
    stream.pipe(res);
  });

  // res.status(200).send('done');
};

exports.pdfStatementByDate = async (req, res) => {
  const uid = uuidv4();
  const json = JSON.parse(req.params.data);
  console.log("---------------------------");
  console.log(json.template);
  console.log("---------------------------");
  // console.log(json);
  // console.log(json.startDate.toString().split("|").join("/"))
  const startDate = json.startDate.toString().split("|").join("/");
  const endDate =  json.endDate.toString().split("|").join("/"); 
  const template =  json.template.toString().split("|").join("/"); 
  console.log("export to PDF form : " + startDate + " " + endDate);
  var templates = "";
    if (json.template === "KTC") {
      // if (accountNumber != "") {
      //   templates = "./templates/pdfTemplateStatementBank.html.ejs";
      // } else {
        templates = "./templates/pdfTemplateStatementScan.html.ejs";
      // }
    } else if (json.template === "KONDEE") {
        templates = "./templates/pdfTemplateStatementScanNew.html.ejs";
    }

  const dataList = await billingService.findStatementByIssueDate(startDate, endDate, template)
  .then((data) => {
    return data;
  })
    .catch((err) => { 
      console.log(err);
      res.status(500).send(err);
    });
  console.log(dataList.length);
  var invoiceNo = [];
  // var totalProcess = 0;
  // var lenProcess = dataList.length;
  var html = "";
  for (var i = 0; i < dataList.length; i++) {
    // var phone = dataList[i].cust_mobile.toString().trim();
    var invoiceno = dataList[i].invoice_no.toString().trim();
    var accountNo = dataList[i].account_no.toString().trim().replace(/[^0-9]/g, "");
    var totalOutBalStr = Number(dataList[i].total_out_bal.toString().trim()).toFixed(2).replace(/[^0-9]/g, "");
    var scanTxtCode ="|010554612702201\\n" +accountNo +"\\n" +invoiceno.replace(/[^0-9]/g, "") +"\\n" +totalOutBalStr;
    var scanTxtCodeShow ="|010554612702201 " +accountNo +" " +invoiceno.replace(/[^0-9]/g, "") +" " +totalOutBalStr;
    var totalOutBalTxt = bahttext.bahttext(Number(dataList[i].total_out_bal.toString().trim()));
    // var accountNumber = dataList[i].account_number.toString();
    
    var detailList = await billingSubService.fileByDateAndPhone(invoiceno)
    .then((data) => {
      return data;
    });

    var groupList = await billingSubService.fileGroupByDateAndPhone(invoiceno)
    .then((data) => {
      return data;
    });

    // console.log(detailList);
    // console.log(groupList);
    html += await ejs.renderFile(
     templates,
      {
        rows: dataList[i],
        detail: detailList,
        group: groupList,
        totalOutBalTxt: totalOutBalTxt,
        scanTxtCode: scanTxtCode,
        scanTxtCodeShow: scanTxtCodeShow,
        chkNum: i,
      },
      { async: true },
    );
  }
  var options = {childProcessOptions: { env: { OPENSSL_CONF: "/dev/null" } },format: "A4", timeout:"300000"};
  // var options = {orientation: 'landscape',type: 'pdf', timeout:"1800000"};
    var file = { content: html };
      pdf.create(html,options).toStream((err, stream) => {
        res.setHeader('Content-type', 'application/pdf');
        res.setHeader('Content-disposition', "attachment;filename=Invoice_" + uid + ".pdf");
        // if (err) {
        //   console.log(
        //     "🚀 ~ file: controller.billing.js ~ line 164 ~ exports.pdfStatementByDate= ~ err",
        //     err
        //   );
        // }else{
        // res.set({
        //   "Content-Type": "application/pdf; charset=utf-8;",
        //   "Content-Disposition": "attachment;filename=Invoice_" + uid + ".pdf",
        // });
        stream.pipe(res);
        
        // stream.pipe(fs.createWriteStream('output.pdf'));
        // console.log('pdf generated');
        // res.send("report will be mailed");
        // totalProcess++;
        // }
        
      })
    //   while (totalProcess < lenProcess) {
    //   await sleep(1000);
    //   console.log(totalProcess);
    // }
    console.log("------------------End----------------"); 
};

exports.zipStatementByDate = async (req, res) => {  
  const uid = uuidv4();
  const filepath = "./files/zipInvoice_" + uid + ".zip";
  const json = JSON.parse(req.params.data);
  console.log("-------------------------");
  console.log(json.template);
  console.log("-------------------------");
  // console.log(json.startDate.replaceAll('|','/'));
  const startDate = json.startDate.toString().split("|").join("/");
  const endDate = json.endDate.toString().split("|").join("/");
  const template =  json.template.toString().split("|").join("/"); 
  const dataList = await billingService.findStatementByIssueDate(startDate, endDate, template)
  .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
  var html=""
  var invoiceNo = [];
  var totalProcess = 0;
  var lenProcess =dataList.length;
  if(dataList.length >0){
  for (var i = 0; i < dataList.length; i++) {
    var phone = dataList[i].cust_mobile.toString().trim();
    invoiceNo[i] = dataList[i].invoice_no.toString().trim();
    var accountNo = dataList[i].account_no.toString().trim().replace(/[^0-9]/g,'');
    var totalOutBalStr = Number(dataList[i].total_out_bal.toString().trim()).toFixed(2).replace(/[^0-9]/g,'');
    var scanTxtCode ="|010554612702201\\n" +accountNo +"\\n" +invoiceNo[i].replace(/[^0-9]/g, "") +"\\n" +totalOutBalStr;
    var scanTxtCodeShow ="|010554612702201 " +accountNo +" " +invoiceNo[i].replace(/[^0-9]/g, "") +" " +totalOutBalStr;
    var totalOutBalTxt = bahttext.bahttext(Number(dataList[i].total_out_bal.toString().trim()));
    // var totalOutBalTxt = bahttext.bahttext(Number(dataList[i].total_out_bal.toString().trim()));
    var issue_date = dataList[i].issue_date.toString().trim().split("/").join("");
    var accountNumber = dataList[i].account_number.toString();
    var templates = "";
    if (json.template === "KTC") {
      // if (accountNumber != "") {
      //   templates = "./templates/pdfTemplateStatementBank.html.ejs";//ไม่มี QR code
      // } else {
        templates = "./templates/pdfTemplateStatementScan.html.ejs";//มี QR code
      // }
    } else if (json.template === "KONDEE") {
        templates = "./templates/pdfTemplateStatementScanNew.html.ejs";
    }
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

    html = await ejs.renderFile(
      templates,
      {
        rows: dataList[i],
        detail: detailList,
        group: groupList,
        totalOutBalTxt: totalOutBalTxt,
        scanTxtCode: scanTxtCode,
        scanTxtCodeShow: scanTxtCodeShow,
        chkNum: i,
      },
      { async: true },
      "utf8"
    );

    var options = {childProcessOptions: { env: { OPENSSL_CONF: '/dev/null' } }, format: "A4", };
    var file = { content: html };
    filename = "./files/zipInvoice_"+uid+"/"+issue_date+"/"+"Invoice" + invoiceNo[i] +".pdf";
  
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
    
    zipFolder('./files/zipInvoice_'+uid, filepath, function(err) {
        console.log("--------------------- zip file statement ---------------------");
        if(err) {
            console.log('err : ', err);
        } else {
            console.log('Zip Statement Done');
            rimraf("./files/zipInvoice_"+uid, function () { console.log("Deleted Folder : zipInvoice_"+uid); });
            res.send(filepath.split("/").join("|"));  
        }
    });
}else{
  res.send("Data is null");
}
};

exports.downloadStatementFileByPath = async (req, res) => {
  console.log("download");
  const json = JSON.parse(req.params.pathdata);
  const path = json.path.split("|").join("/");

  try {
    res.download(path, function(err) {
      // if (err) {
      //   console.log(err); // Check error if you want
      // }
      // fs.unlink(path, function(){
      //     console.log("File was deleted") // Callback
      // });
      // fs.unlink(path, function(err) {
      //   if (err) throw err;
      //   console.log('File deleted!');
      // });
    });

    // file removed
  } catch (err) {
    console.error(err);
  }
};

exports.readStatementExcelFile = async (req, res) => {
  const typeFrom = req.body.typeFile;
  const logNumber = uuidv4();
  let template = "";
  if (typeFrom === "KTC") {
    template = "KTC";
  }else{
    template = "KONDEE";
  }
  var today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy + " " + (today.getHours()) + ":" + today.getMinutes() + ":" + today.getSeconds();
  console.log(today);
  var file = req.files.excelfile;
  const fileName = utf8.decode(file.name.toString());

  var wb = xlsx.read(file.data, { type: "buffer" });
  const ws1 = wb.Sheets[wb.SheetNames[0]];
  const excelRows = xlsx.utils.sheet_to_json(ws1).length;
  // console.log(excelRows);
  if (excelRows >= 1) {
    var cust_name = null;
    var cust_add = null;
    var cust_id = null;
    var account_no = null;
    var invoice_no = null;
    var issue_date = null;
    var tax_id = null;
    var cust_mobile = null;
    var bill_cycle_start = null;
    var expresstion = null;
    var bill_cycle_end = null;
    var over_fee = null;
    var special_number_fee = null;
    var supple_promotion = null;
    var sms = null;
    var mms = null;
    var oversea = null;
    var roaming = null;
    var other = null;
    var sum_over_package = null;
    var out_bal = null;
    var total_out_bal = null;
    var paid_amount = null;
    var vat = null;
    var amount = null;
    var current_due_date = null;
    var account_number = null;
    var cut_date = null;
    var hide_digit = null;
    var current_charge = null;
    var monthly_charge = null;
    var tax_charge = null;
    var total_charge = null;
    var ref1 = null;
    var ref2 = null;
    var advance_payment = null;
    var barcode = null;

    var insertData = [];
    for (var i = 2; i <= excelRows + 1; i++) {
      if (ws1["A" + i] != null) cust_name = ws1["A" + i].w.toString().trim();
      else cust_name = "";
      if (ws1["B" + i] != null) cust_add = ws1["B" + i].w.toString().trim();
      else cust_add = "";
      if (ws1["C" + i] != null) cust_id = ws1["C" + i].w.toString().trim();
      else cust_id = "";
      if (ws1["D" + i] != null) account_no = ws1["D" + i].w.toString().trim();
      else account_no = "";
      if (ws1["E" + i] != null) invoice_no = ws1["E" + i].w.toString().trim();
      if (ws1["F" + i] != null) issue_date = ws1["F" + i].w.toString().trim();
      if (ws1["G" + i] != null) tax_id = ws1["G" + i].w.toString().trim();
      if (ws1["H" + i] != null) cust_mobile = ws1["H" + i].w.toString().trim();
      if (ws1["I" + i] != null)
        bill_cycle_start = ws1["I" + i].w.toString().trim();
      if (ws1["J" + i] != null) expresstion = ws1["J" + i].w.toString().trim();
      if (ws1["K" + i] != null)
        bill_cycle_end = ws1["K" + i].w.toString().trim();
      if (ws1["L1"]) {
        if (ws1["L1"].v == "ค่าบริการส่วนเกินโปรโมชั่น") {
          if (ws1["L" + i] != null) {
            over_fee = ws1["L" + i].v.toString().trim();
          } else over_fee = "0";
        } else if ((ws1["L1"].v = "current_charge")) {
          if (ws1["L" + i] != null) {
            current_charge = ws1["L" + i].v.toString().trim();
          } else current_charge = "0";
        }
      }
      if (ws1["M1"]) {
        if (ws1["M1"].v == "ค่าบริการเลขหมายพิเศษ") {
          if (ws1["M" + i] != null) {
            special_number_fee = ws1["M" + i].v.toString().trim();
          } else special_number_fee = "0";
        } else if (ws1["M1"].v == "outstanding_balance") {
          if (ws1["M" + i] != null) {
            out_bal = ws1["M" + i].v.toString().trim();
          } else out_bal = "0";
        }
      }
      if (ws1["N1"]) {
        if (ws1["N1"].v == "โปรโมชั่นเสริม") {
          if (ws1["N" + i] != null) {
            supple_promotion = ws1["N" + i].v.toString().trim();
          } else supple_promotion = "0";
        } else if ((ws1["N1"].v == "total_outstanding_balance")) {
          if (ws1["N" + i] != null) {
            total_out_bal = ws1["N" + i].v.toString().trim();
          } else total_out_bal = "0";
        }
      }
      if (ws1["O1"]) {
        if (ws1["O1"].v == "SMS") {
          if (ws1["O" + i] != null) {
            sms = ws1["O" + i].v.toString().trim();
          } else sms = "0";
        } else if ((ws1["O1"].w = "current_due_date")) {
          if (ws1["O" + i] != null) {
            current_due_date = ws1["O" + i].w.toString().trim();
          } else current_due_date = "0";
        }
      }
      if (ws1["P1"]) {
        if (ws1["P1"].v == "MMS") {
          if (ws1["P" + i] != null) {
            mms = ws1["P" + i].v.toString().trim();
          } else mms = "0";
        } else if ((ws1["P1"].v == "จำนวนเงิน")) {
          if (ws1["P" + i] != null) {
            monthly_charge = ws1["P" + i].v.toString().trim();
          } else monthly_charge = "0";
        }
      }
      if (ws1["Q1"]) {
        if (ws1["Q1"].v == "Oversea") {
          if (ws1["Q" + i] != null) {
            oversea = ws1["Q" + i].v.toString().trim();
          } else oversea = "0";
        } else if (ws1["Q1"].v == "ภาษีมูลค่าเพิ่ม") {
          if (ws1["Q" + i] != null) {
            tax_charge = ws1["Q" + i].v.toString().trim();
          } else tax_charge = "0";
        }
      }
      if (ws1["R1"]) {
        if (ws1["R1"].v == "Roaming") {
          if (ws1["R" + i] != null) {
            roaming = ws1["R" + i].v.toString().trim();
          } else roaming = "0";
        } else if ((ws1["R1"].v = "รวมค่าใช้บริการ")) {
          if (ws1["R" + i] != null) {
            total_charge = ws1["R" + i].v.toString().trim();
          } else total_charge = "0";
        }
      }
      if (ws1["S1"]) {
        if (ws1["S1"].v == "Other") {
          if (ws1["S" + i] != null) {
            other = ws1["S" + i].v.toString().trim();
          } else other = "0";
        } else if ((ws1["S1"].v = "ref.1")) {
          if (ws1["S" + i] != null) {
            ref1 = ws1["S" + i].v.toString().trim();
          } else ref1 = "0";
        }
      }
      if (ws1["T1"]) {
        if (ws1["T1"].v == "Sum over package") {
          if (ws1["T" + i] != null) {
            sum_over_package = ws1["T" + i].v.toString().trim();
          } else sum_over_package = "0";
        } else if ((ws1["T1"].v == "ref.2")) {
          if (ws1["T" + i] != null) {
            ref2 = ws1["T" + i].v.toString().trim();
          } else ref2 = "0";
        }
      }
      if (ws1["U1"]) {
        if (ws1["U1"].v == "Vat") {
          if (ws1["U" + i] != null) {
            vat = ws1["U" + i].v.toString().trim();
          } else vat = "0";
        } else if ((ws1["U1"].v == "barcode")) {
          if (ws1["U" + i] != null) {
            barcode = ""
          } else barcode = "";
        }
      }
      if (ws1["V1"]) {
        if (ws1["V1"].v == "Amount") {
          if (ws1["V" + i] != null) {
            amount = ws1["V" + i].v.toString().trim();
          } else amount = "0";
        } else if ((ws1["V1"].v == "qrcode_parth")) {
          if (ws1["V" + i] != null) {
            qrcode_parth = ws1["V" + i].v.toString().trim();
          } else qrcode_parth = "0";
        }
      }
      if (ws1["W1"]) {
        if (ws1["W1"].v == "ค่าบริการที่ชำระแล้ว") {
          if (ws1["W" + i] != null) {
            paid_amount = ws1["W" + i].v.toString().trim();
          } else paid_amount = "0";
        } else if (ws1["W1"].v == "Advance payment") {
          if (ws1["W" + i] != null) {
            advance_payment = ws1["W" + i].v.toString().trim();
          } else advance_payment = "0";
        }
      }
      if (ws1["X1"]) {
        if (ws1["X1"].v == "outstanding_balance") {
          if (ws1["X" + i] != null) {
            out_bal = ws1["X" + i].v.toString().trim();
          } else out_bal = "0";
        } else if (ws1["X1"].v == "account_number") {
          if (ws1["X" + i] != null) {
            account_number = ws1["X" + i].v.toString().trim();
          } else account_number = "";
        }
      }
      if (ws1["Y1"]) {
        if (ws1["Y1"].v == "total_outstanding_balance") {
          if (ws1["Y" + i] != null) {
            total_out_bal = ws1["Y" + i].v.toString().trim();
          } else total_out_bal = "0";
        } else if ((ws1["Y1"].v == "วันที่ตัดบัญชี")) {
          if (ws1["Y" + i] != null) {
            cut_date = ws1["Y" + i].w.toString().trim();
          } else cut_date = "";
        }
      }
      if (ws1["Z1"]) {
        if (ws1["Z1"].w == "current_due_date") {
          if (ws1["Z" + i] != null) {
            current_due_date = ws1["Z" + i].w.toString().trim();
          } else current_due_date = "0";
        }
      }
      if (ws1["AA1"]) {
        if (ws1["AA" + i] != null)
          account_number = ws1["AA" + i].w.toString().trim();
        else account_number = "";
      }
      if (ws1["AB1"]) {
        if (ws1["AB" + i] != null) cut_date = ws1["AB" + i].w.toString().trim();
        else cut_date = "";
      }

      // if (ws1["V1"]) {
      //   if (ws1["V" + i] != null) amount = ws1["L" + i].v.toString().trim();
      //   else amount = "0";
      // }
      // if (ws1["L" + i] != null) over_fee = ws1["L" + i].v.toString().trim();else over_fee = "0";
      // if (ws1["M" + i] != null)special_number_fee = ws1["M" + i].v.toString().trim();else special_number_fee = "0";
      // if (ws1["N" + i] != null)supple_promotion = ws1["N" + i].v.toString().trim();else supple_promotion = "0";
      // if (ws1["O" + i] != null) sms = ws1["O" + i].v.toString().trim();else sms = "0";
      // if (ws1["P" + i] != null) mms = ws1["P" + i].v.toString().trim();else mms = "0";
      // if (ws1["Q" + i] != null) oversea = ws1["Q" + i].v.toString().trim();else oversea = "0";
      // if (ws1["R" + i] != null) roaming = ws1["R" + i].v.toString().trim();else roaming = "0";
      // if (ws1["S" + i] != null) other = ws1["S" + i].v.toString().trim();else other = "0";
      // if (ws1["T" + i] != null)sum_over_package = ws1["T" + i].v.toString().trim();else sum_over_package = "0";
      // if (ws1["U" + i] != null) vat = ws1["U" + i].v.toString().trim();else vat = "0";
      // if (ws1["U" + i] != null) out_bal = ws1["U" + i].v.toString().trim();else out_bal = "0";
      // if (ws1["V" + i] != null)amount = ws1["V" + i].v.toString().trim();else amount = "0";
      // if (ws1["V" + i] != null)total_out_bal = ws1["V" + i].v.toString().trim();else total_out_bal = "0";
      // if (ws1["W" + i] != null) paid_amount = ws1["W" + i].v.toString().trim();else vat = "0";
      // if (ws1["X" + i] != null) out_bal = ws1["X" + i].v.toString().trim();else out_bal = "0";
      // if (ws1["Y" + i] != null) total_out_bal = ws1["Y" + i].v.toString().trim();else total_out_bal = "0";
      // if (ws1["O" + i] != null)current_due_date = ws1["O" + i].w.toString().trim();else current_due_date = "";
      // if (ws1["X" + i] != null)account_number = ws1["X" + i].w.toString().trim();else account_number = "";
      // if (ws1["Y" + i] != null)cut_date = ws1["Y" + i].w.toString().trim();else cut_date = "";
      // if (ws1["Z" + i] != null)current_due_date = ws1["Z" + i].w.toString().trim();else current_due_date = "";
      // if (ws1["AA" + i] != null)account_number = ws1["AA" + i].w.toString().trim();else account_number = "";
      // if (ws1["AB" + i] != null)cut_date = ws1["AB" + i].w.toString().trim();else cut_date = "";
      // if (ws1["AC" + i] != null) hide_digit = ws1["AC" + i].w.toString().trim();else hide_digit = "";

      var dataList = {
        cust_name: cust_name,
        cust_add: cust_add,
        cust_id: cust_id,
        account_no: account_no,
        invoice_no: invoice_no,
        issue_date: issue_date,
        tax_id: tax_id,
        cust_mobile: cust_mobile,
        bill_cycle_start: bill_cycle_start,
        expresstion: expresstion,
        bill_cycle_end: bill_cycle_end,
        over_fee: over_fee,
        special_number_fee: special_number_fee,
        supple_promotion: supple_promotion,
        sms: sms,
        mms: mms,
        oversea: oversea,
        roaming: roaming,
        other: other,
        sum_over_package: sum_over_package,
        out_bal: out_bal,
        total_out_bal: total_out_bal,
        paid_amount: paid_amount,
        vat: vat,
        amount: amount,
        current_due_date: current_due_date,
        account_number: account_number,
        cut_date: cut_date,
        hide_digit: hide_digit,
        current_charge: current_charge,
        monthly_charge: monthly_charge,
        tax_charge: tax_charge,
        total_charge: total_charge,
        ref1: ref1,
        ref2: ref2,
        advance_payment: advance_payment,
        barcode: barcode,
        template: template,
        log_number: logNumber,
      };
      // console.log("--------------------------");
      // console.log(current_charge);
      // console.log(dataList);
      // console.log("--------------------------");

      console.log(dataList);
      insertData.push(dataList);
    }
    console.log(`this data insert : ${insertData}`);
    billingService.multiCreate(insertData).catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });

    const ws2 = wb.Sheets[wb.SheetNames[1]];
    const excelRows2 = xlsx.utils.sheet_to_json(ws2).length;
    var sub_invoice_no = null;
    var sub_origin_number = null;
    var sub_call_date = null;
    var sub_call_time = null;
    var sub_destination_number = null;
    var sub_util = null;
    var sub_service_charge_id = null;
    var sub_service_charge_name = null;
    var sub_service_charge_amt = null;
    var sub_sum_over_package = null;
    var sub_out_bal = null;
    var sub_total_out_bal = null;

    var insertData2 = [];
    for (var i = 2; i <= excelRows2 + 1; i++) {
      if (ws2["A" + i] != null)
        sub_invoice_no = ws2["A" + i].w.toString().trim();
      else sub_invoice_no = "";
      if (ws2["B" + i] != null)
        sub_origin_number = ws2["B" + i].w.toString().trim();
      else sub_origin_number = "";
      if (ws2["C" + i] != null)
        sub_call_date = ws2["C" + i].w.toString().trim();
      else sub_call_date = "";
      if (ws2["D" + i] != null)
        sub_call_time = ws2["D" + i].w.toString().trim();
      else sub_call_time = "";
      if (ws2["E" + i] != null)
        sub_destination_number = ws2["E" + i].w.toString().trim();
      else sub_destination_number = "";
      if (ws2["F" + i] != null) sub_util = ws2["F" + i].w.toString().trim();
      else sub_util = "";
      if (ws2["G" + i] != null)
        sub_service_charge_id = ws2["G" + i].w.toString().trim();
      else sub_service_charge_id = "";
      if (ws2["H" + i] != null)
        sub_service_charge_name = ws2["H" + i].w.toString().trim();
      else sub_service_charge_name = "";
      if (ws2["I" + i] != null)
        sub_service_charge_amt = Number(
          ws2["I" + i].v.toString().trim()
        ).toFixed(2);
      else sub_service_charge_amt = "0";
      if (ws2["J" + i] != null)
        sub_sum_over_package = Number(ws2["J" + i].v.toString().trim()).toFixed(2);
      else sub_sum_over_package = "";
      if (ws2["K" + i] != null)
        sub_out_bal = Number(ws2["K" + i].v.toString().trim()).toFixed(2);
      else sub_out_bal = "";
      if (ws2["L" + i] != null)
        sub_total_out_bal = Number(ws2["L" + i].v.toString().trim()).toFixed(2);
      else sub_total_out_bal = "";

      var dataList2 = {
        invoice_no: sub_invoice_no,
        origin_number: sub_origin_number,
        call_date: sub_call_date,
        call_time: sub_call_time,
        destination_number: sub_destination_number,
        unit: sub_util,
        service_charge_id: sub_service_charge_id,
        service_charge_name: sub_service_charge_name,
        service_charge_amt: sub_service_charge_amt,
        sum_over_package: sub_sum_over_package,
        out_bal: sub_out_bal,
        total_out_bal: sub_total_out_bal,
      };
      // console.log(sub_call_time)
      insertData2.push(dataList2);
    }
    console.log(`this data insert : ${insertData2}`); 
    billingSubService
      .multiCreate(insertData2)
      .then(async () => {
        var dataLog = {
          file_name: fileName,
          upload_date: today,
          log_number: logNumber,
          file_type_id: "1",
          file_type_name: "Statement",
          log_type_id: "1",
          log_type_name: "Active",
          template_type: template,
          file_created_status: false,
        };

        await uploadLogService
          .create(dataLog)
          // .then((data) => res.status(200).send("success"))
          .catch((err) => {
            console.log(err);
            res.status(500).send(err);
          });
        await exportStatementToPatch(typeFrom);
        await updateUploadLogCreated();
        res.status(200).send("success");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  } else {
    console.log("Data not found");
    res.send("Data not found");
  }
};
//Invoices
exports.findInvoiceByDate = async (req, res) => {
  const { startDate, endDate, template } = req.body;
  console.log("-----------------------------++++++"+template+"----------------------------");
  invoiceService
    .findInvoiceByIssueDate(startDate, endDate, template)
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
  const startDate = json.startDate.toString().split("|").join("/");
  const endDate = json.endDate.toString().split("|").join("/");
  const id = json.id;
  var date_ob = new Date();
  var date = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();
  var nowDate = date + "/" + month + "/" + year;
  var templates = "";
  if (json.template === "KTC") {
    templates = "./templates/pdfTemplateInvoice.html.ejs";
  } else if (json.template === "KONDEE") {
    templates = "./templates/pdfTemplateInvoicenew.html.ejs";
  }
  
  const dataList = await invoiceService
    .findInvoiceByInvoiceNo(id)
    .then((data) => {
      return data;
    })

    .catch((err) => { 
      console.log(err);
      res.status(500).send(err);
    });
  console.log(dataList+"-------------------------------------");
  for (var i = 0; i < dataList.length; i++) {
    feeAmt = Math.round(dataList[i].vat * 100) / 100;
    if (dataList[i].amount != 0) {
      allAmt = Number(Math.round(dataList[i].amount * 100) / 100).toFixed(2);
    }else{
      allAmt = Number(dataList[i].total).toFixed(2);
    }
    var bathText = bahttext.bahttext(allAmt);
    // var accountNumber = dataList[i].account_number;
    // var templates = "";
    // if (accountNumber === "") {
    //   templates = "./templates/pdfTemplateInvoice.html.ejs";
    // } else {
    //   templates = "./templates/pdfTemplateInvoicenew.html.ejs";
    // }
    var html = await ejs.renderFile(
      templates,
      {
        rows: dataList[i],
        nowDate: nowDate,
        feeAmt: feeAmt,
        allAmt: allAmt,
        bathText: bathText,
      },
      { async: true },
      "utf8"
    );
  }
  // html ="`<html><body>Test</body></html>"
  // console.log("start ----------->")
  var options = {
    childProcessOptions: { env: { OPENSSL_CONF: "/dev/null" } },
    format: "A4",
  };
  // console.log("start ----------->")
  pdf.create(html, options).toStream((err, stream) => {
    if (err) {
      console.log("err : " + err);
      return err;
    }
    // console.log("stream : "+ stream)
    // res.setHeader('Content-Type', 'application/pdf')
    res.set({
      "Content-Type": "application/pdf; charset=utf-8;",
      "Content-Disposition": "attachment;filename=Receipt_" + id + ".pdf",
    });
    stream.pipe(res);
  });
};

exports.pdfInvoiceByDate = async (req, res) => {
  // const nowDate = Date.now();
  var date_ob = new Date();
  var date = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();

  var nowDate = date + "/" + month + "/" + year;
  const json = JSON.parse(req.params.data);
  // console.log(json.startDate.replaceAll('|','/'));
  const startDate = json.startDate.toString().split("|").join("/");
  const endDate = json.endDate.toString().split("|").join("/"); 
  const template = json.template.toString().split("|").join("/"); 
  console.log("export to PDF form : " + startDate + " " + endDate);
  var templates = "";
  if (json.template === "KTC") {
    templates = "./templates/pdfTemplateInvoice.html.ejs";
  } else if (json.template === "KONDEE") {
    templates = "./templates/pdfTemplateInvoicenew.html.ejs";
  }

  var bathText = "";
  var feeAmt = 0;
  var allAmt = 0;
  const dataList = await invoiceService
    .findInvoiceByIssueDate(startDate, endDate, template)
    .then((data) => {
      return data;
    })

    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
  console.log(dataList.length);
  var html = "";
  for (var i = 0; i < dataList.length; i++) {
    feeAmt = Math.round(dataList[i].vat * 100) / 100;
   if (dataList[i].amount != 0) {
     allAmt = Number(Math.round(dataList[i].amount * 100) / 100).toFixed(2);
   } else {
     allAmt = Number(dataList[i].total).toFixed(2);
   }
    bathText = bahttext.bahttext(allAmt);

    html += await ejs.renderFile(
      templates,
      {
        rows: dataList[i],
        nowDate: nowDate,
        feeAmt: feeAmt,
        allAmt: allAmt,
        bathText: bathText,
      },
      { async: true },
      "utf8"
    );
  }

  var options = {
    childProcessOptions: { env: { OPENSSL_CONF: "/dev/null" } },
    format: "A4",
    timeout: "540000",
  };
  var file = { content: html };
  pdf.create(html, options).toStream((err, stream) => {
    // res.setHeader('Content-Type', 'application/pdf')
    if (err) {
      console.log(
        "🚀 ~ file: controller.billing.js ~ line 164 ~ exports.pdfStatementByDate= ~ err",
        err
      );
    }else{
    res.set({
      "Content-Type": "application/pdf; charset=utf-8;",
      "Content-Disposition": "attachment;filename=Receipt_" + startDate + "-" + endDate + ".pdf"
    })
    stream.pipe(res)
    }
  })
};

exports.zipInvoiceByDate = async (req, res) => {
  const uid = uuidv4();
  const filepath = "./files/zipReciept_" + uid + ".zip";
  // const nowDate = Date.now();
  var date_ob = new Date();
  var date = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();

  var filename = [];
  var invoiceNo = [];
  var taxInvoiceNo = [];
  var nowDate = date + "/" + month + "/" + year;
  const json = JSON.parse(req.params.data);
  console.log("------------------");
  console.log(json.template);
  console.log("------------------");
  // console.log(json.startDate.replaceAll('|','/'));
  const startDate = json.startDate.split("|").join("/");
  const endDate = json.endDate.split("|").join("/");
  const template = json.template.split("|").join("/");
  console.log("export to PDF form : " + startDate + " " + endDate);

  var bathText = "";
  var feeAmt = 0;
  var allAmt = 0;
  var templates = "";
  const dataList = await invoiceService
    .findInvoiceByIssueDate(startDate, endDate, template)
    .then((data) => {
      return data;
    })

    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
  var html = "";
  var totalProcess = 0;
  var lenProcess = dataList.length;
  console.log("-------------------"+lenProcess+"-----------------------");
  if (dataList.length > 0) {
    for (var i = 0; i < dataList.length; i++) {
      invoiceNo[i] = dataList[i].invoice_no;
      taxInvoiceNo[i] = dataList[i].tax_invoice_no;
      feeAmt = Math.round(dataList[i].vat * 100) / 100;
      if (dataList[i].amount != 0) {
        allAmt = Number(Math.round(dataList[i].amount * 100) / 100).toFixed(2);
      } else {
        allAmt = Number(dataList[i].total).toFixed(2);
      }
      bathText = bahttext.bahttext(allAmt);
      templates = "";
       if (json.template === "KTC") {
         templates = "./templates/pdfTemplateInvoice.html.ejs";
       } else if (json.template === "KONDEE") {
         templates = "./templates/pdfTemplateInvoicenew.html.ejs";
       }

      html = await ejs.renderFile(
        templates,
        {
          rows: dataList[i],
          nowDate: nowDate,
          feeAmt: feeAmt,
          allAmt: allAmt,
          bathText: bathText,
        },
        { async: true },
        "utf8"
      );

      var options = {
        childProcessOptions: { env: { OPENSSL_CONF: "/dev/null" } },
        format: "A4",
        timeout: "540000"
      };
      filename = "./files/zipReciept_" + uid + "/" +"Reciept" + taxInvoiceNo[i] + ".pdf";
      // console.log(i);

      // await genPDF(html, options,filename) ;
      pdf.create(html, options).toFile(filename, (err, res) => {
        console.log(res);
        totalProcess++;
      });
    }

    while (totalProcess < lenProcess) {
      // setTimeout(() => {  console.log("World!"); }, 2000);
      await sleep(1000);
      console.log(totalProcess);
    }

    zipFolder("./files/zipReciept_" + uid, filepath, function (err) {
      console.log(
        "--------------------- zip file invoice ---------------------"
      );
      if (err) {
        console.log("oh no!", err);
      } else {
        console.log("Zip Invoice Done");
        rimraf("./files/zipReciept_" + uid, function () {
          console.log("Deleted Folder : zipReciept_" + uid);
        });
        res.send(filepath.split("/").join("|"));
      }
    });
  } else {
    res.send("Data is null");
  }
};

exports.downloadInvoiceFileByPath = async (req, res) => {
  console.log("download");
  const json = JSON.parse(req.params.pathdata);
  // console.log("----------------------------");
  // console.log(json);
  // console.log("----------------------------");
  const path = json.path.split("|").join("/");
  
  try {
    res.download(path, function (err) {
      //  if (err) {  
      //    console.log(err); // Check error if you want
      //  }
      // fs.unlink(path, function () {
        
      //   console.log("File was deleted"); // Callback
      // });
    });
    //file removed
  } catch (err) {
    console.error(err);
  }
};

exports.readInvoiceExcelFile = async (req, res) => {
  const typeFrom = req.body.typeFile;
  const logNumber = uuidv4();
  console.log("aaa")
  let template = "";
  if (typeFrom === "KTC") {
    template = "KTC";
  } else {
    template = "KONDEE";
  }
  var today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
  today =mm +"/" +dd +"/" + yyyy +" " +today.getHours() + ":" +today.getMinutes() + ":" +today.getSeconds();
  console.log(today+"---------------------Dateeeeeeee");
  var file = req.files.excelfile;
  const fileName = utf8.decode(file.name.toString());
  var wb = xlsx.read(file.data, { type: "buffer" });
  const wsname = wb.SheetNames[0];  
  const ws = wb.Sheets[wsname];
  const excelRows = xlsx.utils.sheet_to_json(ws).length;
  if (excelRows >= 1) {
    var cust_name = null;
    var cust_add = null;
    var cust_id = null;
    var account_no = null;
    var tax_invoice_no = null;
    var invoice_no = null;
    var issue_date = null;
    var tax_id = null;
    var cust_mobile = null;
    var bill_cycle_start = null;
    var expresstion = null;
    var bill_cycle_end = null;
    var over_fee = null;
    var special_number_fee = null;
    var supple_promotion = null;
    var sms = null;
    var mms = null;
    var oversea = null;
    var roaming = null;
    var other = null;
    var sum_over_package = null;
    var out_bal = null;
    var total_out_bal = null;
    var vat = null;
    var amount = null;
    var monthly_charge = null;
    var advance_fee = null;
    var total_before_vat = null;
    var ref1 = null;
    var total = null;

    var insertData = [];
    for (var i = 2; i <= excelRows + 1; i++) {
      if (ws["A" + i] != null) cust_name = ws["A" + i].w.toString().trim();else cust_name = "";
      if (ws["B" + i] != null) cust_add = ws["B" + i].w.toString().trim();else cust_add = "";
      if (ws["C" + i] != null) cust_id = ws["C" + i].w.toString().trim();else cust_id = "";
      if (ws["D" + i] != null) account_no = ws["D" + i].w.toString().trim();else account_no = "";
      if (ws["E" + i] != null) tax_invoice_no = ws["E" + i].w.toString().trim();
      if (ws["F" + i] != null) invoice_no = ws["F" + i].w.toString().trim();
      if (ws["G" + i] != null) issue_date = ws["G" + i].w.toString().trim();
      if (ws["H" + i] != null) tax_id = ws["H" + i].w.toString().trim();
      if (ws["I" + i] != null) cust_mobile = ws["I" + i].w.toString().trim();
      if (ws["J" + i] != null) bill_cycle_start = ws["J" + i].w.toString().trim();
      if (ws["K" + i] != null) expresstion = ws["K" + i].w.toString().trim();
      if (ws["L" + i] != null) bill_cycle_end = ws["L" + i].w.toString().trim();
      if (ws["M1"]) {
        if (ws["M1"].v == "ค่าบริการส่วนเกินโปรโมชั่น") {
          if (ws["M" + i] != null) {
            over_fee = ws["M" + i].v.toString().trim();
          } else over_fee = "0";
        } else if ((ws["M1"].v == "ค่าบริการรายเดือน")) {
          if (ws["M" + i] != null) {
            monthly_charge = ws["M" + i].v.toString().trim();
            over_fee = "0";
          } else monthly_charge = "0";
        }
      }
      if (ws["N1"]) {
        if (ws["N1"].v == "ค่าบริการเลขหมายพิเศษ") {
          if (ws["N" + i] != null) {
            special_number_fee = ws["N" + i].v.toString().trim();
          } else special_number_fee = "0";
        } else if ((ws["N1"].v == "ค่าบริการล่วงหน้า")) {
          if (ws["N" + i] != null) {
            advance_fee = ws["N" + i].v.toString().trim();
            special_number_fee = "0";
          } else advance_fee = "0";
        }
      }
      if (ws["O1"]) {
        if (ws["O1"].v == "โปรโมชั่นเสริม") {
          if (ws["O" + i] != null) {
            supple_promotion = ws["O" + i].v.toString().trim();
          } else supple_promotion = "0";
        } else if ((ws["O1"].v = "รวมก่อน Vat 7%")) {
          if (ws["O" + i] != null) {
            total_before_vat = ws["O" + i].v.toString().trim();
            supple_promotion = "0";
          } else total_before_vat = "0";
        }
      }
      if (ws["P1"]) {
        if (ws["P1"].v == "SMS") {
          if (ws["P" + i] != null) {
            sms = ws["P" + i].v.toString().trim();
          } else sms = "0";
        } else if ((ws["P1"].v == "vat 7%")) {
          if (ws["P" + i] != null) {
            vat = ws["P" + i].v.toString().trim();
            sms = "0";
          } else vat = "0";
        }
      }
      if (ws["Q1"]) {
        if (ws["Q1"].v == "MMS") {
          if (ws["Q" + i] != null) {
            mms = ws["Q" + i].v.toString().trim();
          } else mms = "0";
        } else if ((ws["Q1"].v == "รวม")) {
          if (ws["Q" + i] != null) {
            total = ws["Q" + i].v.toString().trim();
            mms = "0";
          } else total = "0";
        }
      }
      // if (ws["N" + i] != null) special_number_fee = ws["N" + i].v.toString().trim();else special_number_fee = "0";
      // if (ws["O" + i] != null) supple_promotion = ws["O" + i].v.toString().trim();else supple_promotion = "0";
      // if (ws["P" + i] != null) sms = ws["P" + i].v.toString().trim();else sms = "0";
      // if (ws["Q" + i] != null) mms = ws["Q" + i].v.toString().trim();else mms = "0";
      if (ws["R" + i] != null) oversea = ws["R" + i].v.toString().trim();else oversea = "0";
      if (ws["S" + i] != null) roaming = ws["S" + i].v.toString().trim();else roaming = "0";
      if (ws["T1"]) {
        if (ws["T1"].v == "Other") {
          if (ws["T" + i] != null) {
            other = ws["T" + i].v.toString().trim();
          } else other = "0";
        } else if ((ws["T1"].v == "ref.1")) {
          if (ws["T" + i] != null) {
            ref1 = ws["T" + i].v.toString().trim();
            other = "0";
          } else ref1 = "0";
        }
      }
      // if (ws["T" + i] != null) other = ws["T" + i].v.toString().trim();else other = "0";
      if (ws["U" + i] != null) sum_over_package = ws["U" + i].v.toString().trim();else sum_over_package = "0";
      if (ws["V" + i] != null) out_bal = ws["V" + i].v.toString().trim();else out_bal = "0";
      if (ws["W" + i] != null) total_out_bal = ws["W" + i].v.toString().trim();else total_out_bal = "0";
      if (ws["X1"]) {
        if (ws["X1"].v == "Vat") {
          if (ws["X" + i] != null) {
            vat = ws["X" + i].v.toString().trim();
          } else vat = "0";
        } 
      }
      // if (ws["X" + i] != null) vat = ws["X" + i].v.toString().trim();else vat = "0";
      if (ws["Y" + i] != null) amount = ws["Y" + i].v.toString().trim();else amount = "0";
    
      var dataList = {
        cust_name: cust_name,
        cust_add: cust_add,
        cust_id: cust_id,
        account_no: account_no,
        tax_invoice_no: tax_invoice_no,
        invoice_no: invoice_no,
        issue_date: issue_date,
        tax_id: tax_id,
        cust_mobile: cust_mobile,
        bill_cycle_start: bill_cycle_start,
        expresstion: expresstion,
        bill_cycle_end: bill_cycle_end,
        over_fee: over_fee,
        special_number_fee: special_number_fee,
        supple_promotion: supple_promotion,
        sms: sms,
        mms: mms,
        oversea: oversea,
        roaming: roaming,
        other: other,
        sum_over_package: sum_over_package,
        out_bal: out_bal,
        total_out_bal: total_out_bal,
        vat: vat,
        amount: amount,
        monthly_charge: monthly_charge,
        advance_fee: advance_fee,
        total_before_vat: total_before_vat,
        ref1: ref1,
        total: total,
        template: template,
        log_number: logNumber,
      };
      insertData.push(dataList);
    }
    console.log(`this data insert : ${insertData}`);
    invoiceService
      .multiCreate(insertData)
      .then(async () => {
        var dataLog = {
          file_name: fileName,
          upload_date: today,
          log_number: logNumber,
          file_type_id: "2",
          file_type_name: "Invoice",
          log_type_id: "1",
          log_type_name: "Active",
          template_type: template,
          file_created_status: false,
        };
        await uploadLogService.create(dataLog).catch((err) => {
          console.log(err);
          res.status(500).send(err);
        });
        await exportInvoiceToPatch(typeFrom);
        await updateUploadLogCreated();
        res.status(200).send("success");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  } else {
    console.log("Data not found");
    return res.send("Data not found");
  }
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

const genPDF = async () => {
  await pdf.create(html, options).toFile(filename, (err, res) => {
    console.log(res);
  });
};
// async function genPDF(html, options,filename) {
// pdf.create(html, options).toFile(filename,(err, res)=>{
//     console.log(res)

//   });
// }

async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
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

const exportStatementToPatch = async (typeFrom) => {
  const dataList = await billingService.findNotImportStatement();
  console.log("-------------------------");
  console.log("Statement must Export File : " + dataList.length);
  console.log("Statement must Export File : " + typeFrom);
  console.log("-------------------------");
  if (dataList.length > 0) {
    console.log("------------------ Start Export Statement ------------------");
    const uid = uuidv4();
    const filepath = "./files/zipReciept_" + uid + ".zip";

    var invoiceNo = [];
    var totalProcess = 0;
    var lenProcess = dataList.length;
    for (var i = 0; i < dataList.length; i++) {
      let id = dataList[i].id;
      var phone = dataList[i].cust_mobile.toString().trim();
      invoiceNo[i] = dataList[i].invoice_no.toString().trim();
      var accountNo = dataList[i].account_no.toString().trim();
      var logNumber = dataList[i].log_number.toString().trim();
      var accountNumber = dataList[i].account_number.toString();
      var totalOutBalStr = Number(dataList[i].total_out_bal.toString().trim()).toFixed(2).replace(/[^0-9]/g, "");
      var scanTxtCode ="|010554612702201\\n" +accountNo +"\\n" +invoiceNo[i].replace(/[^0-9]/g, "") +"\\n" +totalOutBalStr;
      var scanTxtCodeShow ="|010554612702201 " +accountNo +" " +invoiceNo[i].replace(/[^0-9]/g, "") + " " +totalOutBalStr;
      var totalOutBalTxt = bahttext.bahttext(Number(dataList[i].total_out_bal.toString().trim()));
      // var totalOutBalTxt = bahttext.bahttext(Number(dataList[i].total_out_bal.toString().trim()));
      var issue_date = dataList[i].issue_date.toString().trim().split("|").join("/");
      console.log("-----------------------"+accountNumber);
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
        
        var templates = "";
        if (typeFrom === "KTC") {
          // if (accountNumber != "") {
          //   templates = "./templates/pdfTemplateStatementBank.html.ejs";
          // } else {
            templates = "./templates/pdfTemplateStatementScan.html.ejs";
          // }
        } else if (typeFrom === "KONDEE") {
          templates = "./templates/pdfTemplateStatementScanNew.html.ejs";
        }

      var html = await ejs.renderFile(
        templates,
        {
          rows: dataList[i],
          detail: detailList,
          group: groupList,
          totalOutBalTxt: totalOutBalTxt,
          scanTxtCode: scanTxtCode,
          scanTxtCodeShow: scanTxtCodeShow,
          chkNum: i,
        },
        { async: true },
        "utf8"
      );

      var options = {
        childProcessOptions: { env: { OPENSSL_CONF: "/dev/null" } },
        format: "A4",
        timeout: "640000",
      };
      // var file = { content: html };
      // filename = `${homePage}/statement/` + logNumber + `/` + accountNo + `/` + `Statement` + invoiceNo[i] + `.pdf`;
      filename = "../../../files/statement/" +logNumber + "/" + accountNo + "/" +"Statement" +invoiceNo[i] + ".pdf";
      // await genPDF(html, options,filename) ;
      pdf.create(html, options).toFile(filename, (err, res) => {
        if (err) {
          console.log("can't create file : " + err);
        } else {
          console.log("create file : " + filename);
          function makeid(length) {
              var result           = '';
              var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
              var charactersLength = characters.length;
              for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
              }
              return result;
          }
          let reference_number = makeid(10);
          // let reference_number = "invoice" + uuidv4();
          totalProcess++;
          const dataUpdate = {
            file_status_id: "1",
            file_status_name: "Created",
            reference_number: reference_number,
          };
          billingService
            .update(id, dataUpdate)
            // .then((data) => res.send(data))
            .catch((err) => {
              console.log(err);
              res.status(500).send(err);
            });
        }
      });
    }

    while (totalProcess < lenProcess) {
      await sleep(1000);
      console.log(totalProcess);
    }

    console.log("------------------ End Export Statement ------------------");
  }
};

const exportInvoiceToPatch = async (typeFrom) => {
  const dataList = await invoiceService.findNotImportInvoice();
  console.log("data : " + dataList.length);
  if (dataList.length > 0) {
    console.log("------------------ Start Export Invoice ------------------");
    // const nowDate = Date.now();
    var date_ob = new Date();
    var date = ("0" + date_ob.getDate()).slice(-2);
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var year = date_ob.getFullYear();
    var templates = "";
    if (typeFrom === "KTC") {
      templates = "./templates/pdfTemplateInvoice.html.ejs";
    } else if (typeFrom === "KONDEE") {
      templates = "./templates/pdfTemplateInvoicenew.html.ejs";
    }

    var filename = [];
    var invoiceNo = [];
    var nowDate = date + "/" + month + "/" + year;
    var bathText = "";
    var feeAmt = 0;
    var allAmt = 0;

    var html = "";
    var totalProcess = 0;
    var lenProcess = dataList.length;
    for (var i = 0; i < dataList.length; i++) {
      invoiceNo[i] = dataList[i].invoice_no;
      let id = dataList[i].id;
      var accountNo = dataList[i].account_no.toString().trim();
      let logNumber = dataList[i].log_number.toString().trim();
      feeAmt = Math.round(dataList[i].vat * 100) / 100;
      allAmt = Number(Math.round(dataList[i].amount * 100) / 100).toFixed(2);
      if (dataList[i].amount != 0) {
        allAmt = Number(Math.round(dataList[i].amount * 100) / 100).toFixed(2);
      } else {
        allAmt = Number(dataList[i].total).toFixed(2);
      }
      bathText = bahttext.bahttext(allAmt);

      html = await ejs.renderFile(
        templates,
        {
          rows: dataList[i],
          nowDate: nowDate,
          feeAmt: feeAmt,
          allAmt: allAmt,
          bathText: bathText,
        },
        { async: true },
        "utf8"
      );

      var options = {
        childProcessOptions: { env: { OPENSSL_CONF: "/dev/null" } },
        format: "A4",
        timeout: "640000",
      };
      filename ="../../../files/invoice/" +logNumber +"/"+accountNo +"/"+"Invoice_"+invoiceNo[i]+".pdf";
      // console.log(i);

      // await genPDF(html, options,filename) ;
      pdf.create(html, options).toFile(filename, (err, res) => {
        if (err) {
          console.log("can't create file : " + err);
        } else {
          console.log("create file : " + filename);
          function makeid(length) {
              var result           = '';
              var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
              var charactersLength = characters.length;
              for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
              }
              return result;
          }
          let reference_number = makeid(10);
          totalProcess++;
          const dataUpdate = {
            file_status_id: "1",
            file_status_name: "Created",
            reference_number: reference_number,
          };
          invoiceService.update(id, dataUpdate).catch((err) => {
            console.log(err);
            res.status(500).send(err);
          });
        }
      });
    }

    while (totalProcess < lenProcess) {
      // setTimeout(() => {  console.log("World!"); }, 2000);
      await sleep(1000);
      console.log(totalProcess);
    }
    console.log("------------------ End Export Invoice ------------------");
  }
};

const updateUploadLogCreated = async (req, res) => {
  uploadLogService.updateByCreateFile({ file_created_status: true });
};

exports.deleteUpload = async (req, res) => {
  console.log(req.body.log_number);
  const logNumber = req.body.log_number;
  const fileTypeId = req.body.file_type_id;
  if (fileTypeId == "1") {
    billingService.deleteByLogNumber(logNumber).catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
    billingSubService.deleteByLogNumber(logNumber).catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
    rimraf("./files/statement/" + logNumber, function () {
      console.log("Deleted file by log : " + logNumber);
    });
  } else if (fileTypeId == "2") {
    invoiceService.deleteByLogNumber(logNumber).catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
    rimraf("./files/invoice/" + logNumber, function () {
      console.log("Deleted file by log : " + logNumber);
    });
  }

  const dataUpdate = { log_type_id: "2", log_type_name: "Deleted" };
  uploadLogService
    .updateByLogNumber(logNumber, dataUpdate)
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
  const templateType = req.body.template_type;
  let phones = [];
  console.log("++++-------------------" +templateType+ "-------------------++++");
  console.log(logNumber);

  if (fileTypeId == "1") {
    console.log("send sms statement");
    const statementList = await billingService
      .findStatementByLog(logNumber)
      .then((data) => {
        return data;
      });
      if(templateType === "KTC"){
         if (statementList.length > 0) {
            for (let i = 0; i < statementList.length; i++) {
              // console.log(statementList[i].cust_mobile)
              phones.push({
                phone: "0654128829",
                // statementList[i].cust_mobile
                mess:
                  "OSD Dual Bill (Project KTC)" +
                  "\n" +
                  "Invioce : http://billing.osd.co.th:3000/api/billing/downloads/statement/" +statementList[i].reference_number +
                  "\n" +
                  "If you require any further information, please contact us at Customer Support Hotline : 020801188",
                Link:
                  "http://billing.osd.co.th:3000/api/billing/downloads/statement/" +statementList[i].reference_number +
                  "",
              });
            }
          }
      }else{
         if (statementList.length > 0) {
            for (let i = 0; i < statementList.length; i++) {
              // console.log(statementList[i].cust_mobile)
              phones.push({
                phone: "0654128829",
                // statementList[i].cust_mobile
                mess:
                  "OSD KONDEE" +
                  "\n" +
                  "Invioce : http://billing.osd.co.th:3000/api/billing/downloads/statement/" +statementList[i].reference_number +
                  "\n" +
                  "หากมีข้อมูลสงสัยหรือสอบถามเพิ่มเติม ได้ที่ 020964111 ทีมงานคนดี",
                  Link:
                  "http://billing.osd.co.th:3000/api/billing/downloads/statement/" +statementList[i].reference_number +
                  "",
              });
            }
          }
      }
  } else if (fileTypeId == "2") {
    console.log("send sms invoice");
    const invoiceList = await invoiceService
      .findInvoiceByLog(logNumber)
      .then((data) => {
        return data;
      });
      if(templateType === "KTC"){
        if (invoiceList.length > 0) {
          for (let i = 0; i < invoiceList.length; i++) {
            // console.log(invoiceList[i].cust_mobile);
            phones.push({
              phone: "0654128829",
              // invoiceList[i].cust_mobile
              mess:
                "OSD Dual Bill (Project KTC)" +
                "\n" +
                "Receipt : http://billing.osd.co.th:3000/api/billing/downloads/invoice/" +invoiceList[i].reference_number +
                "\n" +
                "If you require any further information, please contact us at Customer Support Hotline : 020801188",
                Link:
                  "http://billing.osd.co.th:3000/api/billing/downloads/invoice/" +invoiceList[i].reference_number +
                  "",
            });
          }
        }
      }else{
        if (invoiceList.length > 0) {
          for (let i = 0; i < invoiceList.length; i++) {
            // console.log(invoiceList[i].cust_mobile);
            phones.push({
              phone: "0654128829",
              // invoiceList[i].cust_mobile
              mess:
                "OSD KONDEE" +
                "\n" +
                "Receipt : http://billing.osd.co.th:3000/api/billing/downloads/invoice/" +invoiceList[i].reference_number +
                "\n" +
                "หามีข้อมูลสงสัยสอบถามเพิ่มเติมได้ที่ 020964111 ทีมงานคนดี",
                Link:
                  "http://billing.osd.co.th:3000/api/billing/downloads/invoice/" +invoiceList[i].reference_number +
                  "",
            });
          }
        }
      }
  }
  // Start Axios
  var userSend = JSON.stringify({ 
    username: "dsms",
    password: "dsms1234",
  });
  var dataSMS = JSON.stringify({
    account: "OSD",
    sender: "OSD",
    phones: phones,
  });
  // console.log(dataSMS);
  
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
          sender: "OSD",
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
      console.log();
      exports.getData = () => {
          return dataSMS
      }
      console.log(dataSMS);
    })
    .catch(function (error) {
      console.log(error);
    });
  //End Axios
  const dataUpdate = { file_created_status: "2" };
  uploadLogService
    .updateByLogNumber(logNumber, dataUpdate)
    // .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
  res.send(dataSMS);
  // return dataSMS;
};

exports.downloadFileBySmsCus = async (req, res) => {
  if (req.params.type == "statement") {
    let detail = { reference_number: req.params.refNumber };
    const statement = await billingService.findOneAny(detail).then((data) => {
      return data;
    });
    const file = `${homePage}/statement/` +statement[0].log_number +`/` +statement[0].account_no +`/Statement` +statement[0].invoice_no +`.pdf`;
    // res.download(file);
    // let stream = fs.createReadStream(file);
    // let stat = fs.statSync(file);
    // res.setHeader("Content-Length", stat.size);
    // res.setHeader("Content-Type", "application/pdf");
    // res.setHeader(
    //   "Content-Disposition",
    //   "attachment; filename=Statement" + statement[0].invoice_no + ".pdf"
    // );
    // stream.pipe(res);
    let data =fs.readFileSync(file);
    res.contentType("application/pdf");
    res.send(data);
    
  } else if (req.params.type == "invoice") {
    let detail = { reference_number: req.params.refNumber };
    console.log("------------------Invoice-----------------");
    const invoice = await invoiceService.findOneAny(detail).then((data) => {
      return data;
    });
    const file = `${homePage}/invoice/` +invoice[0].log_number + `/` +invoice[0].account_no +`/Invoice_` +invoice[0].invoice_no +`.pdf`;
    // const path = `${__dirname}/files/img.jpeg`;
    // const filePath = fs.createWriteStream(file);
    // let stream = fs.createReadStream(file);
    // let stat = fs.statSync(file);
    // res.setHeader("Content-Length", stat.size);
    // res.setHeader("Content-Type", "application/pdf");
    // res.setHeader(
    //   "Content-Disposition",
    //   "attachment; filename=Invoice_" + invoice[0].invoice_no + ".pdf"
    // );
    // stream.pipe(res);
    let data =fs.readFileSync(file);
    res.contentType("application/pdf");
    res.send(data);
    // res.download(file);
  }
  // res.send("Success");
};
