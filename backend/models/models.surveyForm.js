module.exports = (sequelize, Sequelize) => {
  const SurveyForm = sequelize.define("db_survey_form", {
    form_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    form_code: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    no: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    effective_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  })

  return SurveyForm
}
