const surveyService = require("../services/services.survey");
const { v4: uuidv4 } = require("uuid");

exports.create = async (req, res) => {
  if (!req.body.company_name || !req.body.title) {
    res.status(400).send({
      message: "users profile can not be empty!",
    });
    return;
  }

  const surveyCode = uuidv4();
  const survey = {
    user_code: req.body.userProfile.code,
    survey_code: surveyCode,
    company_name: req.body.company_name,
    title: req.body.title,
    doc_date: req.body.doc_date,
    details: req.body.details,
    illustration: req.body.illustration,
    issue_date: req.body.issue_date,
    number_users: req.body.number_users,
    remark: req.body.remark,
    note: req.body.note,
    operator_signed: req.body.operator_signed,
    operator_name: req.body.operator_name,
    operator_position: req.body.operator_position,
    operator_date: req.body.operator_date,
    status: req.body.status,
  };

  surveyService
    .create(survey)
    .then((data) => {
      result = {
        surveyCode: surveyCode,
        data: data,
      };
      res.send(result)
    }
    )
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.findAll = async (req, res) => {
  surveyService
    .findAll()
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  surveyService
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
  surveyService
    .update(id, data)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};


exports.delete = (req, res) => {
  const id = req.params.id;
  surveyService
    .delete(id)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.fillAllUsername = async (req, res) => {
  surveyService
    .fillAllUsername()
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};