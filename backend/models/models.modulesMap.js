module.exports = (sequelize, Sequelize) => {
  const ModulesMap = sequelize.define("db_modules_map", {
    module_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    level_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return ModulesMap;
};
