const router = require("express").Router();
const controllerExcel = require("../controllers/controller.exportExcel.js");
const auth = require("../auth");

router.post("/create/:id:survey_code", controllerExcel.export);

router.get("/download", controllerExcel.download);

module.exports = router;