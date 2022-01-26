module.exports = (sequelize, Sequelize) => {
  const SurveyImages = sequelize.define("db_survey_images", {
    survey_code: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image_sequence: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    images: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  });

  return SurveyImages;
};
