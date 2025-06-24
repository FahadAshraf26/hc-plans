import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class DwollaCustodyTransactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of the Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Note: All `...Model` suffixes have been removed from the model names
      // and `DwollaCustodyTransactionsModel` is replaced with `this`.

      this.belongsTo(models.Issuer, {
        foreignKey: "issuerId",
      });

      this.belongsTo(models.DwollaPreBankTransactions, {
        foreignKey: "dwollaPreBankTransactionId",
      });
    }
  }

  // Initialize the model with its attributes and options
  DwollaCustodyTransactions.init(
    {
      // --- Attributes Definition ---
      dwollaCustodyTransactionId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      source: {
        type: DataTypes.STRING,
      },
      destination: {
        type: DataTypes.STRING,
      },
      notCompletedStatus: {
        type: DataTypes.STRING,
      },
      completedStatus: {
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
      isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      failureCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      failureReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "DwollaCustodyTransactions",
      tableName: "dwollaCustodyTransactions",
      timestamps: true,
      paranoid: true,
    }
  );

  return DwollaCustodyTransactions;
};
