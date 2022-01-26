module.exports = (sequelize, Sequelize) => {
  const SurveyDetails = sequelize.define("db_survey_details", {
    survey_code: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    product_code: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    product_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    unit: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    balance: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    stock_status: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    remark: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  });

  return SurveyDetails;
};
