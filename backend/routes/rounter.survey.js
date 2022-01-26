const router = require("express").Router();
const survey = require("../controllers/controller.survey.js");
const auth = require("../auth");

router.post("/", auth(), survey.create);

router.get("/", auth(), survey.findAll);

router.get("/Username", auth(), survey.fillAllUsername);

router.get("/:id", auth(), survey.findOne);

router.put("/:id", auth(), survey.update);

router.delete("/:id", auth(), survey.delete);

module.exports = router;
