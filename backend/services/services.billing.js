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
  multiCreate: (billing) => {
    return new Promise((resolve, reject) => {
      Billing.bulkCreate(billing)
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
  deleteByLogNumber: (log_number) => {
    return new Promise((resolve, reject) => {
        Billing.destroy({
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
  findStatementByInvoiceNo: (invoiceNo) => {
    // console.log(surveycode)
    return new Promise((resolve, reject) => {
      const dataList =  db.sequelize.query(`SELECT * FROM db_billing  WHERE invoice_no = '${invoiceNo}' `, { type: QueryTypes.SELECT });
      resolve(dataList);
    });
  },
  findStatementByIssueDate: (startDate,endDate, template) => {
    console.log(startDate+" - "+endDate)
    return new Promise((resolve, reject) => {
      const dataList =  db.sequelize.query(`SELECT * FROM db_billing  WHERE STR_TO_DATE(issue_date,'%d/%m/%Y')  BETWEEN STR_TO_DATE('${startDate}','%d/%m/%Y') AND STR_TO_DATE('${endDate}','%d/%m/%Y') and  template = '${template}'  `, { type: QueryTypes.SELECT });
      // console.log(dataList);
      resolve(dataList);
    });
  },
  findStatementByLog: (log_number) => {
    return new Promise((resolve, reject) => {
        Billing.findAll({
            where: { log_number: log_number },
        })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
  findNotImportStatement: () => {
    return new Promise((resolve, reject) => {
      Billing.findAll({
          where: { file_status_id: "0" },
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        resolve(err);
      });
  });
  },
  findOneAny: (caseValue ) => {
    return new Promise((resolve, reject) => {
        Billing.findAll({
            where: caseValue,
        })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },

  
}
