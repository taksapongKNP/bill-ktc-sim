module.exports = (sequelize, Sequelize) => {
    const SurveyForm = sequelize.define("db_survey", {
      user_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      survey_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      company_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      details: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      illustration: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      issue_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      number_users: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      remark: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      form_code: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      operator_signed: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      operator_name: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      operator_position: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      operator_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      inspactor_signed: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      inspactor_name: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      inspactor_position: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      inspactor_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    })
  
    return SurveyForm
  }
  