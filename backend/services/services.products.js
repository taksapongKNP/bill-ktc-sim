const db = require("../models");
const Products = db.products;
const Op = db.Sequelize.Op;
const { QueryTypes } = require('sequelize');
module.exports = {
  create: (products) => {
    return new Promise((resolve, reject) => {
      Products.create(products)
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
      Products.findAll()
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
  findByProCode: (procode) => {
    return new Promise((resolve, reject) => {
      Products.findAll({
        where: { product_code: procode },
      })
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
      Products.findAll({
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
    console.log(id)
    return new Promise((resolve, reject) => {
      Products.update(data, {
        where: { product_code: id },
      })
        .then((data) => {
          resolve({
            message: "Products was update successfully!",
          });
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
  delete: (id) => {
    return new Promise((resolve, reject) => {
      Products.destroy({
        where: { id: id },
      })
        .then((num) => {
          if (num == 1) {
            resolve({
              message: "Products was deleted successfully!",
            });
          } else {
            resolve({
              message: `Cannot delete Products with id=${id}. Maybe Products was not found!`,
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
      Products.destroy({ where: { id: data } })
        .then((num) => {
          if (num == 1) {
            resolve({
              message: "Products was deleted successfully!",
            });
          } else {
            resolve({
              message: `Cannot delete Products with id=${id}. Maybe Products was not found!`,
            });
          }
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
  importProduct: (data) => {
    // console.log(data)
    return new Promise((resolve, reject) => {
      Products.bulkCreate(data)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
  fileAllproduct: (surveycode) => {
    console.log(surveycode)
    return new Promise((resolve, reject) => {
      const Dataproduct =  db.sequelize.query(`SELECT s1.id,survey_code,s1.product_code,s1.product_name,quantity,p1.product_num,unit,remark,stock_status FROM db_survey_details AS s1 LEFT JOIN db_products as p1 ON p1.product_code = s1.product_code WHERE s1.survey_code = '${surveycode}' `, { type: QueryTypes.SELECT });
      resolve(Dataproduct);
    });
  }
};
