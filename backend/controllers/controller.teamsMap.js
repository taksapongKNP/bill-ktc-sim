const TeamsMap = require("../services/services.teamsMap");

exports.create = async (req, res) => {
  if (!req.body.teams_id && !req.body.user_id && !req.body.position) {
    res.status(400).send({
      message: "teamsMap name can not be empty!",
    });
    return;
  }

  const teamsMap = {
    teams_id: req.body.teams_id,
    user_id: req.body.user_id,
    position: req.body.position,
    status: req.body.status ? req.body.statu : "active",
  };

  // console.log(`this data insert : ${products}`)
  TeamsMap.create(teamsMap)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.findAll = async (req, res) => {
  TeamsMap.findAll()
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  TeamsMap.findOne(id)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  const data = req.body;
  console.log(data);
  TeamsMap.update(id, data)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  TeamsMap.delete(id)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};
