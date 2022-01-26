module.exports = (sequelize, Sequelize) => {
    const dbForm = sequelize.define("db_billing_sub", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      invoice_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      origin_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      call_date: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      destination_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sum_over_package: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      out_bal: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_out_bal: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      service_charge_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      service_charge_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      service_charge_amt: {
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
     
    })
  
    return dbForm
  }
  