module.exports = (sequelize, Sequelize) => {
  const Teams = sequelize.define("db_teams", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Teams;
};
