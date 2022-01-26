const router = require("express").Router();
const products = require("../controllers/controller.products.js");
const auth = require("../auth");

router.post("/", auth(), products.create);

router.get("/", auth(), products.findAll);

router.get("/:id", auth(), products.findOne);

router.get("/procode/:procode", auth(), products.findByProCode);

router.get("/joinproduct/:surveycode", auth(), products.fileAllproduct);

router.put("/:id", auth(), products.update);

router.delete("/", auth(), products.deleteMultiRow);

router.delete("/:id", auth(), products.delete);

router.post("/importProduct", products.importProduct);

module.exports = router;
