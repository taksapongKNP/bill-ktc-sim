const db = require("../models");
const { QueryTypes } = require('sequelize');

const Billing = db.billingSub;
const Op = db.Sequelize.Op;
module.exports = {
  
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
  }
}
