const router = require("express").Router();
const modules = require("../controllers/controller.modules.js");
const auth = require("../auth");

router.post("/", auth(), modules.create);

router.get("/", auth(), modules.findAll);

router.get("/:id", auth(), modules.findOne);

router.put("/:id", auth(), modules.update);

router.delete("/:id", auth(), modules.delete);

module.exports = router;
