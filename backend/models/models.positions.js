module.exports = (sequelize, Sequelize) => {
  const SurveyForm = sequelize.define("db_positions", {
    position_code: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    position_name_en: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    position_name_th: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });

  return SurveyForm;
};
