const ModulesMap = require("../services/services.modulesMap");

exports.create = async (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "product name can not be empty!",
    });
    return;
  }

  const modulesMap = {
    module_id: req.body.module_id,
    level_id: req.body.level_id,
    status: req.body.status ? req.body.status : false,
  };

  ModulesMap.create(modulesMap)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.findAll = async (req, res) => {
  ModulesMap.findAll()
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  ModulesMap.findOne(id)
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
  ModulesMap.update(id, data)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  ModulesMap.delete(id)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};
