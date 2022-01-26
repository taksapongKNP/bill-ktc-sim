const router = require("express").Router();
const users = require("../controllers/controller.users.js");
const auth = require("../auth");

router.post("/", auth(), users.create);

router.post("/login", users.login);

router.get("/", auth(), users.findAll);

router.get("/profile", auth(), users.findProfile);

router.get("/:code", auth(), users.findByCode);

router.put("/password", auth(), users.changePassword);

router.put("/mypassword", auth(), users.changeMyPassword);

router.put("/:code", auth(), users.updateByCode);

router.delete("/:code", auth(), users.deleteByCode);

module.exports = router;
