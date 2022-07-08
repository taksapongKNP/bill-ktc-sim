const router = require("express").Router();
const billing = require("../controllers/controller.billing.js");
const schedule = require("../schedule/schedule.billing.js");
const auth = require("../auth");

router.get("/", auth(), billing.findStatementAll);
router.post("/statement/findByDate/:startDate:endDate", auth(), billing.findStatementByDate);
router.get("/statement/pdf/:data", billing.exportStatement);
router.get("/statement/pdfByDate/:data", billing.pdfStatementByDate);
router.get("/statement/zipByDate/:data", billing.zipStatementByDate);
// router.get("/statement/downloadPdfByDate", billing.exportStatementbyDate);
router.get("/statement/downloadFileByPath/:pathdata", billing.downloadStatementFileByPath);

router.post("/statement/readExcelFile" ,billing.readStatementExcelFile);
//invoice
router.post("/invoice/findByDate/:startDate:endDate", auth(), billing.findInvoiceByDate);
router.get("/invoice/pdf/:data", billing.exportInvoice);
router.get("/invoice/pdfByDate/:data", billing.pdfInvoiceByDate);
router.get("/invoice/zipByDate/:data", billing.zipInvoiceByDate);
router.get("/invoice/downloadFileByPath/:pathdata", billing.downloadInvoiceFileByPath);

router.post("/invoice/readExcelFile" ,billing.readInvoiceExcelFile);


//upload log
router.get("/uploadLog/get/:data", auth(), billing.findUploadLog);
router.put("/uploadLog/delete", auth(), billing.deleteUpload);
router.put("/uploadLog/sendSms", auth(), billing.sendSmsByLog);

// router.get("/invoice/downloadFileByPath/:pathdata", billing.downloadInvoiceFileByPath);
// router.get("/uploadLog/delete/:logNumber", auth(), billing.deleteUpload);
router.get("/dowloadCustomerFile/:type/:refNumber",billing.downloadFileBySmsCus);

module.exports = router;