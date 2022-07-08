module.exports = {
  dbDev: {
    HOST: "54.238.148.138",
    USER: "osddb",
    PASSWORD: "osddb",
    DB: "bill_sim_ktc",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    PORT: 3306,
  },
  jwtConfig: {
    secretKey: "osd",
    timeExpired: 6000, //seconds
  },
  Local: {
    HOST: "localhost",
    USER: "osdadmin",
    PASSWORD: "osd@1234",
    DB: "bill_sim_ktc",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    PORT: 3306,
  },
  LocalTest: {
    HOST: "localhost",
    USER: "osdadmin",
    PASSWORD: "osdadmin",
    DB: "bill_sim_ktc",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    PORT: 3306,
  },
};
