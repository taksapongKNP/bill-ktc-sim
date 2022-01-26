const db = require("../models");
const TeamsMap = db.teamsMap;
const Op = db.Sequelize.Op;
module.exports = {
  create: (teamsMap) => {
    return new Promise((resolve, reject) => {
      TeamsMap.create(teamsMap)
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
      TeamsMap.findAll()
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
      TeamsMap.findAll({
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
      TeamsMap.update(data, {
        where: { id: id },
      })
        .then((data) => {
          resolve({
            message: "TeamsMap was update successfully!",
          });
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
  delete: (id) => {
    return new Promise((resolve, reject) => {
      TeamsMap.destroy({
        where: { id: id },
      })
        .then((num) => {
          if (num == 1) {
            resolve({
              message: "TeamsMap was deleted successfully!",
            });
          } else {
            resolve({
              message: `Cannot delete TeamsMap with id=${id}. Maybe TeamsMap was not found!`,
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
      TeamsMap.destroy({ where: { id: data } })
        .then((num) => {
          if (num == 1) {
            resolve({
              message: "TeamsMap was deleted successfully!",
            });
          } else {
            resolve({
              message: `Cannot delete TeamsMap with id=${id}. Maybe TeamsMap was not found!`,
            });
          }
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
};
