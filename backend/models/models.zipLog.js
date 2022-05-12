module.exports = (sequelize, Sequelize) => {
  const dbForm = sequelize.define("db_zip_log", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    export_date: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    type_id: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    type_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    start_date: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    end_date: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    file_name: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    created_at: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    updated_at: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    
  })

  return dbForm
}