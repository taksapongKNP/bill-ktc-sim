module.exports = (sequelize, Sequelize) => {
    const invoiceForm = sequelize.define(
      "db_upload_log",
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        file_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        upload_date: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        log_number: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        file_type_id: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        file_type_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        file_created_status: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        log_type_id: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        log_type_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        template_type: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        created_at: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        updated_at: {
          type: Sequelize.STRING,
          allowNull: true,
        },
      },
      {
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  
    return invoiceForm
  }
  