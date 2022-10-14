const Template = require("../services/services.template");
// const {Sequalize, QueryTypes} = require('sequalize');
const { dbDev } = require("../config");

exports.create = async (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "Template name can not be empty!",
    });
    return;
  }

  const template = {
    name: req.body.name,
  };

  // console.log(`this data insert : ${products}`)
  Template.create(template)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.findAll = async (req, res) => {
  console.log("-----------------------------++++++waddee----------------------------");
  Template.findAll()
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Template.findOne(id)
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
  Template.update(id, data)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Template.delete(id)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};



