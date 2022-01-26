const router = require("express").Router();
const billing = require("../controllers/controller.billing.js");
const auth = require("../auth");

router.get("/", auth(), billing.findAll);
router.get("/pdf/:data", billing.export);
router.post("/findByDate/:startDate:endDate", billing.findByDate);
router.get("/pdfByDate/:data", billing.pdfByDate);
router.get("/zipByDate/:data", billing.zipByDate);
router.get("/downloadPdfByDate", billing.exportbyDate);
router.get("/downloadFileByPath/:pathdata", billing.downloadFileByPath);
module.exports = router;