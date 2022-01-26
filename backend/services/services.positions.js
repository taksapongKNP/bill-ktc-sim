const db = require("../models");
const Positions = db.positions;
const Op = db.Sequelize.Op;
module.exports = {
  // create: (products) => {
  //   return new Promise((resolve, reject) => {
  //     Products.create(products)
  //       .then((data) => {
  //         resolve(data);
  //       })
  //       .catch((err) => {
  //         resolve(err);
  //       });
  //   });
  // },
  findAll: () => {
    return new Promise((resolve, reject) => {
      Positions.findAll()
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
  // findByProCode: (procode) => {
  //   return new Promise((resolve, reject) => {
  //     Products.findAll({
  //       where: { product_code: procode },
  //     })
  //       .then((data) => {
  //         resolve(data);
  //       })
  //       .catch((err) => {
  //         resolve(err);
  //       });
  //   });
  // },

  // findOne: (id) => {
  //   return new Promise((resolve, reject) => {
  //     Products.findAll({
  //       where: { id: id },
  //     })
  //       .then((data) => {
  //         resolve(data);
  //       })
  //       .catch((err) => {
  //         resolve(err);
  //       });
  //   });
  // },
  // update: (id, data) => {
  //   return new Promise((resolve, reject) => {
  //     Products.update(data, {
  //       where: { id: id },
  //     })
  //       .then((data) => {
  //         resolve({
  //           message: "Products was update successfully!",
  //         });
  //       })
  //       .catch((err) => {
  //         resolve(err);
  //       });
  //   });
  // },
  // delete: (id) => {
  //   return new Promise((resolve, reject) => {
  //     Products.destroy({
  //       where: { id: id },
  //     })
  //       .then((num) => {
  //         if (num == 1) {
  //           resolve({
  //             message: "Products was deleted successfully!",
  //           });
  //         } else {
  //           resolve({
  //             message: `Cannot delete Products with id=${id}. Maybe Products was not found!`,
  //           });
  //         }
  //       })
  //       .catch((err) => {
  //         resolve(err);
  //       });
  //   });
  // },
  // deleteMultiRow: (data) => {
  //   return new Promise((resolve, reject) => {
  //     Products.destroy({ where: { id: data } })
  //       .then((num) => {
  //         if (num == 1) {
  //           resolve({
  //             message: "Products was deleted successfully!",
  //           });
  //         } else {
  //           resolve({
  //             message: `Cannot delete Products with id=${id}. Maybe Products was not found!`,
  //           });
  //         }
  //       })
  //       .catch((err) => {
  //         resolve(err);
  //       });
  //   });
  // },
};
