const db = require("../models");
const Levels = db.levels;
const Op = db.Sequelize.Op;
module.exports = {
  create: (levels) => {
    return new Promise((resolve, reject) => {
      Levels.create(levels)
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
      Levels.findAll()
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
      Levels.findAll({
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
      Levels.update(data, {
        where: { id: id },
      })
        .then((data) => {
          resolve({
            message: "Levels was update successfully!",
          });
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
  delete: (id) => {
    return new Promise((resolve, reject) => {
      Levels.destroy({
        where: { id: id },
      })
        .then((num) => {
          if (num == 1) {
            resolve({
              message: "Levels was deleted successfully!",
            });
          } else {
            resolve({
              message: `Cannot delete Levels with id=${id}. Maybe Levels was not found!`,
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
      Levels.destroy({ where: { id: data } })
        .then((num) => {
          if (num == 1) {
            resolve({
              message: "Levels was deleted successfully!",
            });
          } else {
            resolve({
              message: `Cannot delete Levels with id=${id}. Maybe Levels was not found!`,
            });
          }
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
};
