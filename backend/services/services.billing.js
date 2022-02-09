const db = require("../models");
const { QueryTypes } = require('sequelize');

const Billing = db.billing;
const Op = db.Sequelize.Op;
module.exports = {
  create: (billing) => {
    return new Promise((resolve, reject) => {
        Billing.create(billing)
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
        Billing.findAll()
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
        Billing.findAll({
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
        Billing.update(data, {
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
        Billing.destroy({
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
        Billing.destroy({ where: { id: data } })
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
  fileByInvoiceNo: (invoiceNo) => {
    // console.log(surveycode)
    return new Promise((resolve, reject) => {
      const dataList =  db.sequelize.query(`SELECT * FROM db_billing  WHERE invoice_no = '${invoiceNo}' `, { type: QueryTypes.SELECT });
      resolve(dataList);
    });
  },
  fileByBillCycleStart: (startDate,endDate) => {
    console.log(startDate+" - "+endDate)
    return new Promise((resolve, reject) => {
      const dataList =  db.sequelize.query(`SELECT * FROM db_billing  WHERE STR_TO_DATE(bill_cycle_start,'%d/%m/%Y')  BETWEEN STR_TO_DATE('${startDate}','%d/%m/%Y') AND STR_TO_DATE('${endDate}','%d/%m/%Y')  `, { type: QueryTypes.SELECT });
      resolve(dataList);
    });
  },
  findInvoiceByBillCycleStart: (startDate,endDate) => {
    console.log(startDate+" - "+endDate)
    return new Promise((resolve, reject) => {
      const dataList =  db.sequelize.query(`SELECT * FROM db_invoice  WHERE STR_TO_DATE(bill_cycle_start,'%d/%m/%Y')  BETWEEN STR_TO_DATE('${startDate}','%d/%m/%Y') AND STR_TO_DATE('${endDate}','%d/%m/%Y')  `, { type: QueryTypes.SELECT });
      resolve(dataList);
    });
  }
}
