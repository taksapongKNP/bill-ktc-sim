const Levels = require("../services/services.levels");

exports.create = async (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "product name can not be empty!",
    });
    return;
  }

  const levels = {
    name: req.body.name,
  };

  // console.log(`this data insert : ${products}`)
  Levels.create(levels)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.findAll = async (req, res) => {
  Levels.findAll()
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Levels.findOne(id)
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
  Levels.update(id, data)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Levels.delete(id)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.deleteMultiRow = (req, res) => {
  const data = req.body.data;
  Levels.deleteMultiRow(data)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};
