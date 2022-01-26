const router = require("express").Router();
const modulesMap = require("../controllers/controller.modulesMap.js");
const auth = require("../auth");

router.post("/", auth(), modulesMap.create);

router.get("/", auth(), modulesMap.findAll);

router.get("/:id", auth(), modulesMap.findOne);

router.put("/:id", auth(), modulesMap.update);

router.delete("/:id", auth(), modulesMap.delete);

module.exports = router;
