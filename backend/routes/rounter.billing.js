const router = require("express").Router();
const billing = require("../controllers/controller.billing.js");
const auth = require("../auth");

router.get("/", auth(), billing.findStatementAll);
router.get("/statement/pdf/:data", billing.exportStatement);
router.post("/statement/findByDate/:startDate:endDate", billing.findStatementByDate);
router.get("/statement/pdfByDate/:data", billing.pdfStatementByDate);
router.get("/statement/zipByDate/:data", billing.zipStatementByDate);
router.get("/statement/downloadPdfByDate", billing.exportStatementbyDate);
router.get("/statement/downloadFileByPath/:pathdata", billing.downloadStatementFileByPath);

router.post("/invoice/findByDate/:startDate:endDate", billing.findInvoiceByDate);
router.get("/invoice/pdfByDate/:data", billing.pdfInvoiceByDate);
module.exports = router;