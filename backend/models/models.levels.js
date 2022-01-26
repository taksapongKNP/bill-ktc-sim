module.exports = (sequelize, Sequelize) => {
  const Levels = sequelize.define("db_levels", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Levels;
};
