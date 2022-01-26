const db = require("../models");
const SurveyImages = db.surveyImages;
const Op = db.Sequelize.Op;
module.exports = {
  create: (surveyImages) => {
    return new Promise((resolve, reject) => {
      SurveyImages.create(surveyImages)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
  createMultiRows: (surveyImages) => {
    return new Promise((resolve, reject) => {
      SurveyImages.bulkCreate(surveyImages)
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
      SurveyImages.findAll()
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
      SurveyImages.findAll({
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
      SurveyImages.update(data, {
        where: { id: id },
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
      SurveyImages.destroy({
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
