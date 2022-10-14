const router = require("express").Router();
const template = require("../controllers/controller.template.js");
const auth = require("../auth");

router.post("/", auth(), template.create);

router.get("/gettemplate", template.findAll);

// router.get("/querytemplate", auth(), template.querytemplate);

router.get("/:id", auth(), template.findOne);

router.put("/:id", auth(), template.update);

router.delete("/:id", auth(), template.delete);

module.exports = router;
