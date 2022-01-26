const db = require("../models");
const { QueryTypes } = require('sequelize');

const Billing = db.billingSub;
const Op = db.Sequelize.Op;
module.exports = {
  
  fileByDateAndPhone: (phone,startDate,endDate) => {
    return new Promise((resolve, reject) => {
      const dataList =  db.sequelize.query(`SELECT * FROM db_billing_sub  WHERE origin_number = '${phone}' AND ( STR_TO_DATE(call_date,'%d/%m/%Y')  BETWEEN STR_TO_DATE('${startDate}','%d/%m/%Y') AND STR_TO_DATE('${endDate}','%d/%m/%Y') )  `, { type: QueryTypes.SELECT });
      resolve(dataList);
    });
  },
  fileGroupByDateAndPhone: (phone,startDate,endDate) => {
    return new Promise((resolve, reject) => {
      const dataList =  db.sequelize.query(`SELECT service_charge_id as gid,MAX(service_charge_name) as gname,count(*) as count_data  FROM db_billing_sub  WHERE origin_number = '${phone}' AND ( STR_TO_DATE(call_date,'%d/%m/%Y')  BETWEEN STR_TO_DATE('${startDate}','%d/%m/%Y') AND STR_TO_DATE('${endDate}','%d/%m/%Y') ) GROUP BY service_charge_id `, { type: QueryTypes.SELECT });
      resolve(dataList);
    });
  }
}
