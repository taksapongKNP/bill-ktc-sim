const db = require("../models");
const { QueryTypes } = require('sequelize');

const ServiceCharge = db.serviceCharge;
const Op = db.Sequelize.Op;
module.exports = {
  create: (serviceCharge) => {
    return new Promise((resolve, reject) => {
        ServiceCharge.create(serviceCharge)
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
        ServiceCharge.findAll()
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          resolve(err);
        });
    });
  }
};
