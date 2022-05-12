module.exports = (sequelize, Sequelize) => {
    const invoiceForm = sequelize.define("db_invoice", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      cust_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cust_add: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      cust_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      account_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      invoice_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      issue_date: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tax_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cust_mobile: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bill_cycle_start: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      expresstion: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bill_cycle_end: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      over_fee: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      special_number_fee: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      supple_promotion: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sms: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mms: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      oversea: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      roaming: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      other: {
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
      hide_digit: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      current_charge: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_out_bal: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vat: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      amount: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      current_due_date: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      account_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cut_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      hide_digit: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      log_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tax_invoice_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      file_status_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      file_status_name: {
        type: Sequelize.STRING,
        allowNull: true,
      }
    
    },
    {
        charset: "utf8",
        collate: "utf8_general_ci",
    })
  
    return invoiceForm
  }
  