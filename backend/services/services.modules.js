const db = require("../models");
const Modules = db.modules;
const Op = db.Sequelize.Op;
module.exports = {
  create: (modules) => {
    return new Promise((resolve, reject) => {
      Modules.create(modules)
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
      Modules.findAll()
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
      Modules.findAll({
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
      Modules.update(data, {
        where: { id: id },
      })
        .then((data) => {
          resolve({
            message: "Modules was update successfully!",
          });
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
  delete: (id) => {
    return new Promise((resolve, reject) => {
      Modules.destroy({
        where: { id: id },
      })
        .then((num) => {
          if (num == 1) {
            resolve({
              message: "Modules was deleted successfully!",
            });
          } else {
            resolve({
              message: `Cannot delete Modules with id=${id}. Maybe Modules was not found!`,
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
      Modules.destroy({ where: { id: data } })
        .then((num) => {
          if (num == 1) {
            resolve({
              message: "Modules was deleted successfully!",
            });
          } else {
            resolve({
              message: `Cannot delete Modules with id=${id}. Maybe Modules was not found!`,
            });
          }
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
};
