const db = require("../models");
const ModulesMap = db.modulesMap;
const Op = db.Sequelize.Op;
module.exports = {
  create: (modulesMap) => {
    return new Promise((resolve, reject) => {
      ModulesMap.create(modulesMap)
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
      ModulesMap.findAll()
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
      ModulesMap.findAll({
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
      ModulesMap.update(data, {
        where: { id: id },
      })
        .then((data) => {
          resolve({
            message: "ModulesMap was update successfully!",
          });
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
  delete: (id) => {
    return new Promise((resolve, reject) => {
      ModulesMap.destroy({
        where: { id: id },
      })
        .then((num) => {
          if (num == 1) {
            resolve({
              message: "ModulesMap was deleted successfully!",
            });
          } else {
            resolve({
              message: `Cannot delete ModulesMap with id=${id}. Maybe ModulesMap was not found!`,
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
      ModulesMap.destroy({ where: { id: data } })
        .then((num) => {
          if (num == 1) {
            resolve({
              message: "ModulesMap was deleted successfully!",
            });
          } else {
            resolve({
              message: `Cannot delete ModulesMap with id=${id}. Maybe ModulesMap was not found!`,
            });
          }
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
};
