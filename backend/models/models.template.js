module.exports = (sequelize, Sequelize) => {
  const dbTemplate = sequelize.define("db_template", {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      template: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  )

  return dbTemplate
}