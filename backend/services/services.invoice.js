const db = require("../models");
const { QueryTypes } = require('sequelize');

const Invoice = db.invoice;
const Op = db.Sequelize.Op;
module.exports = {
  create: (invoice) => {
    return new Promise((resolve, reject) => {
        Invoice.create(invoice)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
  multiCreate: (invoice) => {
    return new Promise((resolve, reject) => {
        Invoice.bulkCreate(invoice)
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
        Invoice.findAll()
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
        Invoice.findAll({
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
        Invoice.update(data, {
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
        Invoice.destroy({
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
        Invoice.destroy({ where: { id: data } })
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
      Invoice.destroy({
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
  findInvoiceByInvoiceNo: (invoiceNo) => {
    // console.log(surveycode)
    return new Promise((resolve, reject) => {
      const dataList =  db.sequelize.query(`SELECT * FROM db_invoice WHERE invoice_no = '${invoiceNo}' `, { type: QueryTypes.SELECT });
      resolve(dataList);
    });
  },
  findInvoiceByIssueDate: (startDate,endDate, template) => {
    console.log(startDate+" - "+endDate)
    return new Promise((resolve, reject) => {
      const dataList =  db.sequelize.query(`SELECT * FROM db_invoice  WHERE STR_TO_DATE(issue_date,'%d/%m/%Y')  BETWEEN STR_TO_DATE('${startDate}','%d/%m/%Y') AND STR_TO_DATE('${endDate}','%d/%m/%Y') and  template = '${template}'  `, { type: QueryTypes.SELECT });
      resolve(dataList);
    });
  },
  findInvoiceByLog: (log_number) => {
    return new Promise((resolve, reject) => {
        Invoice.findAll({
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
  findNotImportInvoice: () => {
    return new Promise((resolve, reject) => {
      Invoice.findAll({
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
        Invoice.findAll({
            where: caseValue,
        })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          resolve(err);
        });
    });
  }
}
