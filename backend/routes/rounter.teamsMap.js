const router = require("express").Router();
const teamsMap = require("../controllers/controller.teamsMap.js");
const auth = require("../auth");

router.post("/", auth(), teamsMap.create);

router.get("/", auth(), teamsMap.findAll);

router.get("/:id", auth(), teamsMap.findOne);

router.put("/:id", auth(), teamsMap.update);

router.delete("/:id", auth(), teamsMap.delete);

module.exports = router;
