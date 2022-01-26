module.exports = (sequelize, Sequelize) => {
    const billingForm = sequelize.define("db_billing", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      cust_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cust_add: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cust_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      account_no: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      invoice_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      issue_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      tax_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cust_mobile: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      bill_cycle_start: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      expresstion: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      bill_cycle_end: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      over_fee: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      special_number_fee: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      supple_promotion: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      sms: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      mms: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      oversea: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      roaming: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      other: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      sum_over_package: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      out_bal: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      hide_digit: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      current_charge: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      total_out_bal: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      vat: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      amount: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      current_due_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      account_number: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      cut_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      hide_digit: {
        type: Sequelize.DATE,
        allowNull: true,
      }
    
    },
    {
        charset: "utf8",
        collate: "utf8_general_ci",
    })
  
    return billingForm
  }
  