const router = require("express").Router();
const billing = require("../controllers/controller.billing.js");
const auth = require("../auth");

router.get("/", auth(), billing.findStatementAll);
router.post("/statement/findByDate/:startDate:endDate", billing.findStatementByDate);
router.get("/statement/pdf/:data", billing.exportStatement);
router.get("/statement/pdfByDate/:data", billing.pdfStatementByDate);
router.get("/statement/zipByDate/:data", billing.zipStatementByDate);
// router.get("/statement/downloadPdfByDate", billing.exportStatementbyDate);
router.get("/statement/downloadFileByPath/:pathdata", billing.downloadStatementFileByPath);

router.post("/invoice/findByDate/:startDate:endDate", billing.findInvoiceByDate);
router.get("/invoice/pdf/:data", billing.exportInvoice);
router.get("/invoice/pdfByDate/:data", billing.pdfInvoiceByDate);
router.get("/invoice/zipByDate/:data", billing.zipInvoiceByDate);
router.get("/invoice/downloadFileByPath/:pathdata", billing.downloadInvoiceFileByPath);

module.exports = router;