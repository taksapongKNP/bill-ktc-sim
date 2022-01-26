module.exports = (sequelize, Sequelize) => {
  const Modules = sequelize.define("db_modules", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Modules;
};
