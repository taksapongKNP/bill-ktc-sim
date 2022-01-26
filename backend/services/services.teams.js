const db = require("../models");
const Teams = db.teams;
const Op = db.Sequelize.Op;
module.exports = {
  create: (teams) => {
    return new Promise((resolve, reject) => {
      Teams.create(teams)
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
      Teams.findAll()
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
      Teams.findAll({
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
      Teams.update(data, {
        where: { id: id },
      })
        .then((data) => {
          resolve({
            message: "Teams was update successfully!",
          });
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
  delete: (id) => {
    return new Promise((resolve, reject) => {
      Teams.destroy({
        where: { id: id },
      })
        .then((num) => {
          if (num == 1) {
            resolve({
              message: "Teams was deleted successfully!",
            });
          } else {
            resolve({
              message: `Cannot delete Teams with id=${id}. Maybe Teams was not found!`,
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
      Teams.destroy({ where: { id: data } })
        .then((num) => {
          if (num == 1) {
            resolve({
              message: "Teams was deleted successfully!",
            });
          } else {
            resolve({
              message: `Cannot delete Teams with id=${id}. Maybe Teams was not found!`,
            });
          }
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
};
