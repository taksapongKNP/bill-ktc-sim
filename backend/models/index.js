const { Sequelize } = require("sequelize");
const { dbDev } = require("../config/index");

const sequelize = new Sequelize(dbDev.DB, dbDev.USER, dbDev.PASSWORD, {
  host: dbDev.HOST,
  port: 3306,
  dialect: dbDev.dialect,
  define: {
    underscored: true,
    freezeTableName: true, //use singular table name
    // timestamps: false,  // I do not want timestamp fields by default
    charset: "utf8",
    collate: "utf8_general_ci",
  },
  dialectOptions: {
    // useUTC: false, //for reading from database
    dateStrings: true,
    typeCast: function (field, next) {
      // for reading from database
      if (field.type === "DATETIME") {
        return field.string();
      }
      return next();
    },
  },
  timezone: "+07:00",
});

// try {
//     sequelize.authenticate();
//     console.log('connect database successfully');
// } catch (error) {
//     console.error('Unable to connect to the database:', error);
// }

const db = {};

db.users = require("./models.users.js")(sequelize, Sequelize);
db.survey = require("./models.survey")(sequelize, Sequelize);
db.surveyDetails = require("./models.surveyDetails")(sequelize, Sequelize);
db.surveyForm = require("./models.surveyForm")(sequelize, Sequelize);
db.surveyImages = require("./models.surveyImages")(sequelize, Sequelize);
db.products = require("./models.products")(sequelize, Sequelize);
db.modules = require("./models.modules")(sequelize, Sequelize);
db.modulesMap = require("./models.modulesMap")(sequelize, Sequelize);
db.levels = require("./models.levels")(sequelize, Sequelize);
db.exportexcel = require("./models.exportExcel.js");
db.positions = require("./models.positions")(sequelize, Sequelize);
db.teams = require("./models.teams")(sequelize, Sequelize);
db.teamsMap = require("./models.teamsMap")(sequelize, Sequelize);
db.billing = require("./models.billing")(sequelize, Sequelize);
db.serviceCharge = require("./models.serviceCharge")(sequelize, Sequelize);
db.billingSub = require("./models.billingSub")(sequelize, Sequelize);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
