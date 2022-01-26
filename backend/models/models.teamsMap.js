module.exports = (sequelize, Sequelize) => {
  const TeamsMap = sequelize.define("db_teams_map", {
    teams_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    position: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return TeamsMap;
};
