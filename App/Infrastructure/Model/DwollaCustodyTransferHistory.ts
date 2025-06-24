import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class DwollaCustodyTransferHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of the Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Note: All `...Model` suffixes have been removed from the model names
      // and `DwollaCustodyTransferHistoryModel` is replaced with `this`.

      this.belongsTo(models.Issuer, {
        foreignKey: "issuerId",
        constraints: false,
      });

      this.hasMany(models.DwollaPostBankTransactions, {
        foreignKey: "dwollaCustodyTransferHistoryId",
        constraints: false,
      });
    }
  }

  // Initialize the model with its attributes and options
  DwollaCustodyTransferHistory.init(
    {
      // --- Attributes Definition ---
      dwollaCustodyTransferHistoryId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      source: {
        type: DataTypes.STRING,
      },
      destination: {
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
      modelName: "DwollaCustodyTransferHistory",
      tableName: "dwollaCustodyTransferHistories", // Explicitly set table name
      timestamps: true,
      paranoid: true,
    }
  );

  return DwollaCustodyTransferHistory;
};
