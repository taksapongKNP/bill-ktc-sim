const db = require("../models");
const SurveyDetails = db.surveyDetails;
const Op = db.Sequelize.Op;
module.exports = {
  create: (survey) => {
    return new Promise((resolve, reject) => {
      SurveyDetails.create(survey)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
  findAll: () => {
    return new Promise((resolve, reject) => {
      SurveyDetails.findAll()
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
  findOne: (id) => {
    return new Promise((resolve, reject) => {
      SurveyDetails.findAll({
        where: { survey_code: id },
      })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
  update: (id, data) => {
    return new Promise((resolve, reject) => {
      SurveyDetails.update(data, {
        where: { [Op.and]: [
          { survey_code: id },
          { product_code: data.product_code }
        ] },
      })
        .then((data) => {
          resolve({
            message: "Survey was update successfully!",
          });
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
  delete: (id) => {
    return new Promise((resolve, reject) => {
      SurveyDetails.destroy({
        where: { id: id },
      })
        .then((num) => {
          if (num == 1) {
            resolve({
              message: "Survey was deleted successfully!",
            });
          } else {
            resolve({
              message: `Cannot delete Survey with id=${id}. Maybe Products was not found!`,
            });
          }
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
};
