const userService = require("../services/services.users");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

//Generate Password
const generatePassword = async (password) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const passwordHashed = await bcrypt.hash(password, salt);
  return passwordHashed;
};

//Create Users
exports.create = async (req, res) => {
  if (!req.body.username || !req.body.password || !req.body.name) {
    res.status(400).send({
      message: "users profile can not be empty!",
    });
    return;
  }

  const user_code = uuidv4();
  const users = {
    name: req.body.name,
    username: req.body.username,
    password: await generatePassword(req.body.password),
    code: user_code,
    email: req.body.email,
    team: req.body.team,
    position: req.body.position,
    level: req.body.level,
    type: req.body.type,
    status: "Active",
  };
  userService
    .create(users)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

//Create Token
exports.login = (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send({
      message: "username or password can not be empty!",
    });
    return;
  }
  const username = req.body.username.toLowerCase();
  const password = req.body.password;
  const statusAdmin = username.includes("admin");

  // loginAdmin
  if (!statusAdmin) {
    userService
      .login(username, password)
      .then((data) => res.send(data))
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  } else {
    userService
      .loginAdmin(username, password)
      .then((data) => res.send(data))
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  }
};

//Get Data All
exports.findAll = (req, res) => {
  userService
    .findAll()
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

//Get Data One
exports.findByCode = (req, res) => {
  const code = req.params.code;
  userService
    .findByCode(code)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

//Get Data One
exports.updateByCode = (req, res) => {
  const code = req.params.code;
  const data = req.body;
  userService
    .updateByCode(code, data)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.deleteByCode = (req, res) => {
  const code = req.params.code;
  userService
    .deleteByCode(code)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.changePassword = async (req, res) => {
  const code = req.body.code;
  const newPassword = await generatePassword(req.body.newPassword);
  const data = { password: newPassword };
  userService
    .updateByCode(code, data)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.changeMyPassword = async (req, res) => {
  const code = req.body.userProfile.code;
  const newPassword = await generatePassword(req.body.newPassword);
  const data = { password: newPassword };
  userService
    .updateByCode(code, data)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.findProfile = async (req, res) => {
  const code = req.body.userProfile.code;
  console.log(code);
  userService
    .findProfile(code)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};
