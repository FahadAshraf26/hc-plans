import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class DwollaPostBankTransactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of the Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Note: All `...Model` suffixes have been removed from the model names
      // and `DwollaPostBankTransactionsModel` is replaced with `this`.

      this.belongsTo(models.Issuer, {
        foreignKey: "issuerId",
      });

      this.belongsTo(models.DwollaPreBankTransactions, {
        foreignKey: "dwollaPreBankTransactionId",
      });

      this.belongsTo(models.DwollaCustodyTransferHistory, {
        foreignKey: "dwollaCustodyTransferHistoryId",
        constraints: false,
      });
    }
  }

  // Initialize the model with its attributes and options
  DwollaPostBankTransactions.init(
    {
      // --- Attributes Definition ---
      dwollaPostBankTransactionId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      source: {
        type: DataTypes.STRING,
      },
      destination: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
      },
      idempotencyId: {
        type: DataTypes.STRING,
      },
      dwollaTransferId: {
        type: DataTypes.STRING,
      },
      businessOwnerName: {
        type: DataTypes.STRING,
      },
      businessOwnerEmail: {
        type: DataTypes.STRING,
      },
      amount: {
        type: DataTypes.FLOAT,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "DwollaPostBankTransactions",
      tableName: "dwollaPostBankTransactions",
      timestamps: true,
      paranoid: true,
    }
  );

  return DwollaPostBankTransactions;
};
