const surveyImagesService = require("../services/services.surveyImages");

exports.create = async (req, res) => {
  if (!req.body.survey_code || !req.body.image_sequence || !req.body.images) {
    res.status(400).send({
      message: "survey images can not be empty!",
    });
    return;
  }
  const surveyImages = {
    survey_code: req.body.survey_code,
    image_sequence: req.body.image_sequence,
    images: req.body.images,
  }
  surveyImagesService
    .create(surveyImages)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.createMultiRows = async (req, res) => {
  const surveyImages = req.body;
  console.log(surveyImages)
  surveyImagesService
    .createMultiRows(surveyImages)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.findAll = async (req, res) => {
  surveyImagesService
    .findAll()
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  surveyImagesService
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
  surveyImagesService
    .update(id, data)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  surveyImagesService
    .delete(id)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};
