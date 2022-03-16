const db = require("../models");
const { QueryTypes } = require('sequelize');

const BillingSub = db.billingSub;
const Op = db.Sequelize.Op;
module.exports = {
  multiCreate: (billingSub) => {
    return new Promise((resolve, reject) => {
      BillingSub.bulkCreate(billingSub)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
  fileByDateAndPhone: (invoice) => {
    return new Promise((resolve, reject) => {
      const dataList =  db.sequelize.query(`SELECT * FROM db_billing_sub  WHERE invoice_no = '${invoice}'  `, { type: QueryTypes.SELECT });
      resolve(dataList);
    });
  },
  fileGroupByDateAndPhone: (invoice) => {
    return new Promise((resolve, reject) => {
      const dataList =  db.sequelize.query(`SELECT service_charge_id as gid,MAX(service_charge_name) as gname,count(*) as count_data  FROM db_billing_sub  WHERE invoice_no = '${invoice}' GROUP BY service_charge_id `, { type: QueryTypes.SELECT });
      resolve(dataList);
    });
  },
  deleteByLogNumber: (log_number) => {
    return new Promise((resolve, reject) => {
      BillingSub.destroy({
        where: { log_number: log_number },
      })
        .then((num) => {
          if (num == 1) {
            resolve({
              message: "Teams was deleted successfully!",
            });
          } else {
            resolve({
              message: `Cannot delete Teams with log_number=${log_number}. Maybe Teams was not found!`,
            });
          }
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
}
