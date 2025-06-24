import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class Investor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of the Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Note: All `...Model` suffixes have been removed from the model names
      // and `InvestorModel` is replaced with `this`.

      // --- Preserving commented-out associations ---
      // models.InvestorBank.belongsTo(this, {
      //   foreignKey: 'investorId',
      // });
      // this.hasMany(models.InvestorBank, {
      //   foreignKey: 'investorId',
      // });

      models.CampaignFund.belongsTo(this, {
        foreignKey: "investorId",
      });
      this.hasMany(models.CampaignFund, {
        foreignKey: "investorId",
      });

      models.User.hasOne(this, {
        foreignKey: "userId",
        as: "userSender",
      });

      models.Repayment.belongsTo(this, {
        foreignKey: "investorId",
      });
      this.hasMany(models.Repayment, {
        foreignKey: "investorId",
      });

      // investorPayments
      models.InvestorPayments.belongsTo(this, {
        foreignKey: "investorId",
      });
      this.hasMany(models.InvestorPayments, {
        foreignKey: "investorId",
      });

      // campaignNotification
      this.hasMany(models.CampaignNotification, {
        foreignKey: "investorId",
      });

      this.hasMany(models.FavoriteCampaign, {
        foreignKey: "investorId",
      });
    }
  }

  // Initialize the model with its attributes and options
  Investor.init(
    {
      // --- Attributes Definition ---
      investorId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      annualIncome: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      netWorth: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      incomeVerificationTriggered: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      investingAvailable: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isAccredited: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      investmentCap: {
        type: DataTypes.INTEGER,
      },
      userProvidedCurrentInvestments: {
        type: DataTypes.BIGINT,
      },
      userProvidedCurrentInvestmentsDate: {
        type: DataTypes.DATE,
      },
      investReadyToken: {
        type: DataTypes.STRING,
      },
      investReadyRefreshToken: {
        type: DataTypes.STRING,
      },
      investReadyUserHash: {
        type: DataTypes.STRING,
      },
      accreditationExpiryDate: {
        type: DataTypes.DATE,
      },
      dwollaCustomerId: {
        type: DataTypes.STRING,
      },
      accreditedInvestorSubmission: {
        type: DataTypes.STRING,
      },
      accreditedInvestorSubmissionDate: {
        type: DataTypes.DATEONLY,
      },
      dwollaVerificationStatus: {
        type: DataTypes.STRING,
      },
      ncAccountId: {
        type: DataTypes.STRING,
      },
      incomeNetWorthSignedOn: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      vcCustomerKey: {
        type: DataTypes.STRING,
      },
      vcThreadBankCustomerKey: {
        type: DataTypes.STRING,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "Investor",
      tableName: "investors", // Explicitly set table name
      timestamps: true,
      paranoid: true,
    }
  );

  return Investor;
};
