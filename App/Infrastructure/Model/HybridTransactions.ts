import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class HybridTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of the Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Note: `HybridTransactionModel` is replaced with `this`, and
      // `CampaignFundModel` is updated to its v6 class name.
      this.belongsTo(models.CampaignFund, {
        foreignKey: "campaignFundId",
      });
    }
  }

  // Initialize the model with its attributes and options
  HybridTransaction.init(
    {
      // --- Attributes Definition ---
      hybridTransactionId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
      },
      transactionType: {
        type: DataTypes.STRING,
      },
      tradeId: {
        type: DataTypes.STRING,
      },
      refrenceNumber: {
        type: DataTypes.STRING,
      },
      dwollaTransactionId: {
        type: DataTypes.STRING,
      },
      individualACHId: {
        type: DataTypes.STRING,
      },
      applicationFee: {
        type: DataTypes.FLOAT,
      },
      status: {
        type: DataTypes.STRING,
      },
      isSent: {
        type: DataTypes.BOOLEAN,
      },
      walletAmount: {
        type: DataTypes.FLOAT,
      },
      source: {
        type: DataTypes.STRING,
      },
      debitAuthorizationId: {
        type: DataTypes.STRING,
      },
      nachaFileName: {
        type: DataTypes.STRING,
      },
      achRefunded: {
        type: DataTypes.BOOLEAN,
      },
      walletRefunded: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "HybridTransaction",
      tableName: "hybridTransactions", // Explicitly set table name
      timestamps: true,
      paranoid: true,
    }
  );

  return HybridTransaction;
};
