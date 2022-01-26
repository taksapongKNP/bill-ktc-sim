const router = require("express").Router();
const positions = require("../controllers/controller.positions.js");
const auth = require("../auth");

// router.post("/", auth(), positions.create);

router.get("/", auth(), positions.findAll);

// router.get("/:id", auth(), positions.findOne);

// router.get("/procode/:procode", auth(), positions.findByProCode);

// router.put("/:id", auth(), positions.update);

// router.delete("/", auth(), positions.deleteMultiRow);

// router.delete("/:id", auth(), positions.delete);

module.exports = router;
