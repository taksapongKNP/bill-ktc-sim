const { Sequelize } = require("sequelize");
const { Local,LocalTest, dbDev } = require("../config/index");

console.log(`this host is : ${dbDev.HOST}`)

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
db.modules = require("./models.modules")(sequelize, Sequelize);
db.modulesMap = require("./models.modulesMap")(sequelize, Sequelize);
db.levels = require("./models.levels")(sequelize, Sequelize);
db.positions = require("./models.positions")(sequelize, Sequelize);
db.teams = require("./models.teams")(sequelize, Sequelize);
db.teamsMap = require("./models.teamsMap")(sequelize, Sequelize);
db.billing = require("./models.billing")(sequelize, Sequelize);
db.billingSub = require("./models.billingSub")(sequelize, Sequelize);
db.invoice = require("./models.invoice")(sequelize, Sequelize);
db.uploadLog = require("./models.uploadLog")(sequelize, Sequelize);
db.zipLog = require("./models.zipLog")(sequelize, Sequelize);

db.Sequelize = Sequelize;
db.sequelize = sequelize;


module.exports = db;
