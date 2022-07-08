const db = require("../models");
const { QueryTypes } = require('sequelize');

const UploadLog = db.uploadLog;
const Op = db.Sequelize.Op;
module.exports = {
  create: (uploadLog) => {
    return new Promise((resolve, reject) => {
        UploadLog.create(uploadLog)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
  multiCreate: (uploadLog) => {
    return new Promise((resolve, reject) => {
        UploadLog.bulkCreate(uploadLog)
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
        UploadLog.findAll()
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
  findByDate: (upload_date) => {
    return new Promise((resolve, reject) => {
      const dataList =  db.sequelize.query(`SELECT * FROM db_upload_log WHERE DATE_FORMAT(STR_TO_DATE(upload_date,"%d/%m/%Y %H:%i:%s"),'%Y-%m-%d') = DATE_FORMAT('${upload_date}','%Y-%m-%d') `, { type: QueryTypes.SELECT });
      resolve(dataList);
    });
  },
  findOne: (id) => {
    return new Promise((resolve, reject) => {
        UploadLog.findAll({
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
  findByType: (typeId) => {
    return new Promise((resolve, reject) => {
        UploadLog.findAll({
            where: { file_type_id: typeId },
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
        UploadLog.update(data, {
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
  updateByCreateFile: (data) => {
    return new Promise((resolve, reject) => {
        UploadLog.update(data, {
            where: { file_created_status: false },
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
  updateByLogNumber: (logNumber, data) => {
    return new Promise((resolve, reject) => {
        UploadLog.update(data, {
            where: { log_number: logNumber },
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
        UploadLog.destroy({ where: { id: data } })
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
}
