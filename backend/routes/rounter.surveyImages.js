const router = require("express").Router();
const surveyImages = require("../controllers/controller.surveyImages.js");
const auth = require("../auth");

router.post("/", auth(), surveyImages.create);

router.post("/multirows", auth(), surveyImages.createMultiRows);

router.get("/", auth(), surveyImages.findAll);

router.get("/:id", auth(), surveyImages.findOne);

router.put("/:id", auth(), surveyImages.update);

router.delete("/:id", auth(), surveyImages.delete);

module.exports = router;
