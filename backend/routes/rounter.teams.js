const router = require("express").Router();
const teams = require("../controllers/controller.teams.js");
const auth = require("../auth");

router.post("/", auth(), teams.create);

router.get("/", auth(), teams.findAll);

router.get("/:id", auth(), teams.findOne);

router.put("/:id", auth(), teams.update);

router.delete("/:id", auth(), teams.delete);

module.exports = router;
