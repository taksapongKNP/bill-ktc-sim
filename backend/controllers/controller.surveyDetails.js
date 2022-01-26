const surveyDetailsService = require("../services/services.surveyDetails");

exports.create = async (req, res) => {
  if (!req.body.product_code || !req.body.product_name) {
    res.status(400).send({
      message: "users profile can not be empty!",
    });
    return;
  }
  const surveyDetails = {
    survey_code: req.body.survey_code,
    product_code: req.body.product_code,
    product_name: req.body.product_name,
    quantity: req.body.quantity,
    unit: req.body.unit,
    balance: req.body.balance,
    stock_status: req.body.stock_status,
    remark: req.body.remark,
  };

  surveyDetailsService
    .create(surveyDetails)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.findAll = async (req, res) => {
  surveyDetailsService
    .findAll()
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  surveyDetailsService
    .findOne(id)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  const data = req.body;
  surveyDetailsService
    .update(id, data)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  surveyDetailsService
    .delete(id)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};
