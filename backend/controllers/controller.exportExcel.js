const exportService = require("../services/services.exportExcel.js");

exports.export = async (req, res) => {
  const { id, survey_code } = req.body;
  exportService
    .export(id, survey_code)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.download = async (req, res) => {
  const id = req.params.id;
  exportService
    .download(id)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};
