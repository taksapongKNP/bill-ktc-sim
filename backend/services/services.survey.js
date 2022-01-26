const db = require("../models");
const Survey = db.survey;
const Op = db.Sequelize.Op;
const { QueryTypes } = require('sequelize');
module.exports = {
  create: (survey) => {
    return new Promise((resolve, reject) => {
      Survey.create(survey)
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
      Survey.findAll()
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
      Survey.findAll({
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
      Survey.update(data, {
        where: { survey_code: id },
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
      Survey.destroy({
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
  fillAllUsername:  () => {
    return new Promise((resolve, reject) => {
      const Dataimage =  db.sequelize.query(`SELECT db_survey.id,db_users.name,db_survey.survey_code,db_survey.company_name,db_survey.title,db_survey.status,db_survey.doc_date FROM db_survey INNER JOIN db_users ON db_users.code = db_survey.user_code`, { type: QueryTypes.SELECT });
      console.log(Dataimage)
      resolve(Dataimage)
    });
  }
};
