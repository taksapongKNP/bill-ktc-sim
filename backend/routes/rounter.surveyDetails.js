const router = require("express").Router();
const surveyDetails = require("../controllers/controller.surveyDetails.js");
const auth = require("../auth");

router.post("/", auth(), surveyDetails.create);

router.get("/", auth(), surveyDetails.findAll);

router.get("/:id", auth(), surveyDetails.findOne);

router.put("/:id", auth(), surveyDetails.update);

router.delete("/:id", auth(), surveyDetails.delete);

module.exports = router;
