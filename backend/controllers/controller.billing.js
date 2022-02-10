const billingService = require("../services/services.billing");
const billingSubService = require("../services/services.billingSub");
const { v4: uuidv4 } = require("uuid");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const JSZip = require("jszip");
const bahttext =require("bahttext");
const pdf = require('html-pdf');
var htmlToPdf = require("html-pdf-node");
const ejs = require("ejs");

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
    .findStatementByBillCycleStart(startDate, endDate)
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
    var phone = dataList[i].cust_mobile.trim();
    var invoice = dataList[i].invoice_no.trim();
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
      "./templates/pdfTemplateByDate.html.ejs",
      {
        rows: dataList[i],
        detail: detailList,
        group: groupList,
      },
      { async: true }
    );
  }
  let options = { format: "A4" };
  let file = { content: html };

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
};

exports.pdfStatementByDate = async (req, res) => {

  const json = JSON.parse(req.params.data);
  // console.log(json.startDate.replaceAll('|','/'));
  const startDate = json.startDate.replaceAll('|','/');
  const endDate = json.endDate.replaceAll('|','/');
  console.log('export to PDF form : '+startDate+' '+endDate);

  
  const dataList = await billingService.findStatementByBillCycleStart(startDate, endDate)
  .then((data) => {
    return data;
  })

  .catch((err) => {
    console.log(err);
    res.status(500).send(err);
  });

  var html=""
  for(var i = 0; i < dataList.length; i++){

    var phone = dataList[i].cust_mobile.trim();
    var invoice = dataList[i].invoice_no.trim();
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
      "./templates/pdfTemplateByDate.html.ejs",
      {
        rows: dataList[i],
        detail : detailList,
        group : groupList
      },
      {async :true},"utf8"
    );
  }

  let options = {format: "A4"};
  let  file = {content: html};
  pdf.create(html, options).toStream(
    (err, stream) => {
      // res.setHeader('Content-Type', 'application/pdf')
      res.set({
            "Content-Type": "application/pdf; charset=utf-8;",
            "Content-Disposition": "attachment;filename=Statement_"+startDate+"-"+endDate+".pdf"
          })
      stream.pipe(res)
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
    .findStatementByBillCycleStart(startDate, endDate)
    .then((data) => {
      return data;
    })

    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
  var buffer = [];
  var invoiceNo = [];
  for (var i = 0; i < dataList.length; i++) {
    var phone = dataList[i].cust_mobile.trim();
    invoiceNo[i] = dataList[i].invoice_no.trim();
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

    console.log(phone);
    var html = await ejs.renderFile(
      "./templates/zipTemplateByDate.html.ejs",
      {
        rows: dataList[i],
        detail: detailList,
        group: groupList,
      },
      { async: false }
    );

    let options = { format: "A4" };
    let file = { content: html };

    buffer[i] = await getBuffer(file, options);
  }

  var zip = new JSZip();
  for (var i = 0; i < dataList.length; i++) {
    zip.file("Statement" + invoiceNo[i] + ".pdf", buffer[i], { base64: true });
  }
  await zip.generateAsync({ type: "nodebuffer" }).then(function (content) {
    // see FileSaver.js
    fs.writeFileSync(filepath, content);
  });

  res.send(filepath.replaceAll("/", "|"));
};

exports.downloadStatementFileByPath = async (req, res) => {
  console.log("download");
  const json = JSON.parse(req.params.pathdata);
  const path = json.path.replaceAll("|", "/");

  try {
    if (res.download(path)) {
      fs.unlinkSync(path);
    }

    //file removed
  } catch (err) {
    console.error(err);
  }
};







//Invoices 
exports.findInvoiceByDate = async (req, res) => {
  const { startDate, endDate } = req.body;
  billingService
    .findInvoiceByBillCycleStart(startDate, endDate)
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

  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  
  let nowDate = date+"/"+month+"/"+(year);
  const dataList = await billingService.findInvoiceByInvoiceNo(id)
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

  let options = {format: "A4"};
  let  file = {content: html};
  pdf.create(html, options).toStream(
    (err, stream) => {
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
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  
  let nowDate = date+"/"+month+"/"+(year);
  const json = JSON.parse(req.params.data);
  // console.log(json.startDate.replaceAll('|','/'));
  const startDate = json.startDate.replaceAll('|','/');
  const endDate = json.endDate.replaceAll('|','/');
  console.log('export to PDF form : '+startDate+' '+endDate);

  let bathText = '';
  let feeAmt =0;
  let allAmt =0;
  const dataList = await billingService.findInvoiceByBillCycleStart(startDate, endDate)
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

  let options = {format: "A4"};
  let  file = {content: html};
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
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  
  var buffer = [];
  var invoiceNo = [];

  let nowDate = date+"/"+month+"/"+(year);
  const json = JSON.parse(req.params.data);
  // console.log(json.startDate.replaceAll('|','/'));
  const startDate = json.startDate.replaceAll('|','/');
  const endDate = json.endDate.replaceAll('|','/');
  console.log('export to PDF form : '+startDate+' '+endDate);

  let bathText = '';
  let feeAmt =0;
  let allAmt =0;
  const dataList = await billingService.findInvoiceByBillCycleStart(startDate, endDate)
  .then((data) => {
    return data;
  })

  .catch((err) => {
    console.log(err);
    res.status(500).send(err);
  });
  var html=""
  for(var i = 0; i < dataList.length; i++){
    invoiceNo[i] = dataList[i].invoice_no;
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

  let options = {format: "A4"};
  let  file = {content: html};
  buffer[i] = await getBuffer(file, options);

  }
  var zip = new JSZip();
  for (var i = 0; i < dataList.length; i++) {
    zip.file("Invoice" + invoiceNo[i] + ".pdf", buffer[i], { base64: true });
  }
  await zip.generateAsync({ type: "nodebuffer" }).then(function (content) {
    // see FileSaver.js
    fs.writeFileSync(filepath, content);
  });
  res.send(filepath.replaceAll("/", "|"));

};

exports.downloadInvoiceFileByPath = async (req, res) => {
  console.log("download");
  const json = JSON.parse(req.params.pathdata);
  const path = json.path.replaceAll("|", "/");

  try {
    if (res.download(path)) {
      fs.unlinkSync(path);
    }

    //file removed
  } catch (err) {
    console.error(err);
  }
};



//Function
function getBuffer(file, options) {
  var buffer = htmlToPdf
    .generatePdf(file, options)
    .then((pdfBuffer) => {
      console.log(pdfBuffer);
      return pdfBuffer;
    })
    .catch((err) => {
      res.send({ success: false, err: err });
    });
  return buffer;
}




