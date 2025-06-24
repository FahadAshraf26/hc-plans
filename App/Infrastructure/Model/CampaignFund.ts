import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class CampaignFund extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of the Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Note: All `...Model` suffixes have been removed from the model names
      // and `CampaignFundModel` is replaced with `this` to refer to the current class.

      this.belongsTo(models.Charge, {
        foreignKey: "chargeId",
        as: "charge",
      });

      models.Charge.hasOne(this, {
        foreignKey: "chargeId",
        as: "investmentCharge",
      });

      // Note: These associations define a one-to-one relationship from another model *to* this one.
      // For clarity, these could also be defined in their respective model files (investor.js, campaign.js).
      models.Investor.hasOne(this, {
        foreignKey: "investorId",
        as: "investor",
      });

      models.Campaign.hasOne(this, {
        foreignKey: "campaignId",
        as: "campaign",
      });

      this.hasMany(models.HybridTransaction, {
        foreignKey: "campaignFundId",
        as: "campaignHybridTransactions",
      });

      // --- Preserving commented-out associations ---
      // this.belongsTo(models.InvestorPaymentOption, {
      //   foreignKey: "investorPaymentOptionsId",
      //   as: "paymentOption"
      // })

      // models.CampaignFundIntermediatoryCharge.belongsTo(this, {
      //   foreignKey: 'campaignFundId',
      //   as: 'intermediatoryCharge',
      // });

      // this.hasOne(models.CampaignFundIntermediatoryCharge, {
      //   foreignKey: 'campaignFundId',
      //   as: 'intermediatoryCharge',
      // });

      // this.hasMany(models.CampaignFundFinalCharge, {
      //   foreignKey: 'campaignFundId',
      //   as: 'finalCharges',
      // });
      // models.EntityCampaignFund.hasOne(this, {
      //     foreignKey: 'campaignFundId',
      //     as: 'entityCampaignFund',
      // });
    }
  }

  // Initialize the model with its attributes and options
  CampaignFund.init(
    {
      // --- Attributes Definition ---
      campaignFundId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      investorAccreditationStatus: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      investorNetWorth: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      investorAnnualIncome: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      investmentType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ip: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      entityId: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      promotionCredits: {
        type: DataTypes.FLOAT,
      },
      netAmount: {
        type: DataTypes.FLOAT,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "CampaignFund",
      tableName: "campaignFunds",
      timestamps: true,
      paranoid: true,
    }
  );

  return CampaignFund;
};
