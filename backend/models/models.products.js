module.exports = (sequelize, Sequelize) => {
  const SurveyForm = sequelize.define("db_products", {
    product_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    product_code: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    product_price: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    product_status: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    product_num: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    product_unit: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });

  return SurveyForm;
};
