const billingService = require("../services/services.billing");
const billingSubService = require("../services/services.billingSub");
const { v4: uuidv4 } = require("uuid");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const JSZip = require("jszip");

var htmlToPdf = require("html-pdf-node");
const ejs = require("ejs");

exports.findAll = async (req, res) => {
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

exports.findByDate = async (req, res) => {
  const { startDate, endDate } = req.body;
  billingService
    .fileByBillCycleStart(startDate, endDate)
    .then((data) => {
      res.send(data);
    })

    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
  // res.send("success");
};

exports.export = async (req, res) => {
  const json = JSON.parse(req.params.data);
  const startDate = json.startDate.replaceAll("|", "/");
  const endDate = json.endDate.replaceAll("|", "/");
  const id = json.id;

  const dataList = await billingService
    .fileByInvoiceNo(id)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
  console.log("aa" + dataList);
  var html = "";
  for (var i = 0; i < dataList.length; i++) {
    var phone = dataList[i].cust_mobile.trim();
    var detailList = await billingSubService
      .fileByDateAndPhone(phone, startDate, endDate)
      .then((data) => {
        return data;
      });

    var groupList = await billingSubService
      .fileGroupByDateAndPhone(phone, startDate, endDate)
      .then((data) => {
        return data;
      });
    html += await ejs.renderFile(
      "./templates/pdfTemplateByDate.html",
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

  htmlToPdf
    .generatePdf(file, options)
    .then((pdfBuffer) => {
      res
        .writeHead(200, {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment;",
        })
        .end(pdfBuffer);
    })
    .catch((err) => {
      res.send({ success: false, err: err });
    });
};

// exports.pdfByDate = async (req, res) => {
//   const json = JSON.parse(req.params.data);
//   // console.log(json.startDate.replaceAll('|','/'));
//   const startDate = json.startDate.replaceAll("|", "/");
//   const endDate = json.endDate.replaceAll("|", "/");
//   console.log("export PDF from :" + startDate + " to " + endDate);

//   const dataList = await billingService
//     .fileByBillCycleStart(startDate, endDate)
//     .then((data) => {
//       return data;
//     })

//     .catch((err) => {
//       console.log(err);
//       res.status(500).send(err);
//     });
//   const PDFGenerator = require("pdfkit");
//   const fs = require("fs");

//   // instantiate the library
//   let theOutput = new PDFGenerator();

//   // pipe to a writable stream which would save the result into the same directory
//   theOutput.pipe(fs.createWriteStream("TestDocument.pdf"));

//   theOutput.text("Some awesome example text");

//   // write out file
//   theOutput.end();
//   // res.send("success");
// };

exports.zipByDate = async (req, res) => {
  const uid = uuidv4();
  const filepath = "./files/bill_" + uid + ".zip";
  const json = JSON.parse(req.params.data);
  // console.log(json.startDate.replaceAll('|','/'));
  const startDate = json.startDate.replaceAll("|", "/");
  const endDate = json.endDate.replaceAll("|", "/");
  const dataList = await billingService
    .fileByBillCycleStart(startDate, endDate)
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
      .fileByDateAndPhone(phone, startDate, endDate)
      .then((data) => {
        return data;
      });

    var groupList = await billingSubService
      .fileGroupByDateAndPhone(phone, startDate, endDate)
      .then((data) => {
        return data;
      });

    console.log(phone);
    var html = await ejs.renderFile(
      "./templates/pdfTemplateByDate.html.ejs",
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
    zip.file("BILL_" + invoiceNo[i] + ".pdf", buffer[i], { base64: true });
  }
  zip.generateAsync({ type: "nodebuffer" }).then(function (content) {
    // see FileSaver.js
    fs.writeFileSync(filepath, content);
  });

  res.send(filepath.replaceAll("/", "|"));
};

exports.downloadFileByPath = async (req, res) => {
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

exports.exportbyDate = async (req, res) => {
  res
    .writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment;filename=Billing.pdf",
    })
    .send(req.params.buffer);
};

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

exports.pdfByDate = async (req, res) => {

  const json = JSON.parse(req.params.data);
  // console.log(json.startDate.replaceAll('|','/'));
  const startDate = json.startDate.replaceAll('|','/');
  const endDate = json.endDate.replaceAll('|','/');
  console.log('export to PDF form : '+startDate+' '+endDate);

  
  const dataList = await billingService.fileByBillCycleStart(startDate, endDate)
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
    var detailList = await billingSubService.fileByDateAndPhone(phone,startDate, endDate)
    .then((data) => {
      return data;
    });

    var groupList = await billingSubService.fileGroupByDateAndPhone(phone,startDate, endDate)
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
      {async :true}
    );
  }

  let options = {format: "A4"};
  let  file = {content: html};
  htmlToPdf
  .generatePdf(file, options)
  .then((pdfBuffer)=>{
    // res.send(pdfBuffer);
    res.writeHead(200,{
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment;filename=Billing.pdf"
    }).end(pdfBuffer);
  })
  .catch((err) => {
    res.send({success:false,err:err});
  });

};
