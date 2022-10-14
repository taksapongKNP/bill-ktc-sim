const db = require("../models");
const Template = db.template;
const Op = db.Sequelize.Op;
const { QueryTypes } = require('sequelize');
// const {Sequalize, QueryTypes} = require('sequalize');
module.exports = {
  create: (template) => {
    return new Promise((resolve, reject) => {
      Template.create(template)
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
      const dataTemplate =  db.sequelize.query(`SELECT template FROM db_template `, { type: QueryTypes.SELECT });
      // console.log(dataList);
      resolve(dataTemplate);
    });
  },
  findOne: (id) => {
    return new Promise((resolve, reject) => {
      Template.findAll({
        where: { id: id },
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
      Template.update(data, {
        where: { id: id },
      })
        .then((data) => {
          resolve({
            message: "Template was update successfully!",
          });
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
  delete: (id) => {
    return new Promise((resolve, reject) => {
      Template.destroy({
        where: { id: id },
      })
        .then((num) => {
          if (num == 1) {
            resolve({
              message: "Template was deleted successfully!",
            });
          } else {
            resolve({
              message: `Cannot delete Template with id=${id}. Maybe Template was not found!`,
            });
          }
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
  deleteMultiRow: (data) => {
    return new Promise((resolve, reject) => {
      Template.destroy({ where: { id: data } })
        .then((num) => {
          if (num == 1) {
            resolve({
              message: "Template was deleted successfully!",
            });
          } else {
            resolve({
              message: `Cannot delete Template with id=${id}. Maybe Template was not found!`,
            });
          }
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },


};
