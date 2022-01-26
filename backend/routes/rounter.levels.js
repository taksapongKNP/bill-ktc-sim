const router = require("express").Router();
const levels = require("../controllers/controller.levels.js");
const auth = require("../auth");

router.post("/", auth(), levels.create);

router.get("/", auth(), levels.findAll);

router.get("/:id", auth(), levels.findOne);

router.put("/:id", auth(), levels.update);

router.delete("/:id", auth(), levels.delete);

module.exports = router;
