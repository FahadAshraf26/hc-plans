import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class DwollaPostTransactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of the Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Note: All `...Model` suffixes have been removed from the model names
      // and `DwollaPostTransactionsModel` is replaced with `this`.

      this.belongsTo(models.Issuer, {
        foreignKey: "issuerId",
      });

      this.belongsTo(models.DwollaPreTransactions, {
        foreignKey: "dwollaPreTransactionId",
      });
    }
  }

  // Initialize the model with its attributes and options
  DwollaPostTransactions.init(
    {
      // --- Attributes Definition ---
      dwollaPostTransactionId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      source: {
        type: DataTypes.STRING,
      },
      destination: {
        type: DataTypes.STRING,
      },
      interestPaid: {
        type: DataTypes.FLOAT,
      },
      principalPaid: {
        type: DataTypes.FLOAT,
      },
      total: {
        type: DataTypes.FLOAT,
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
      fileName: {
        type: DataTypes.STRING,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "DwollaPostTransactions",
      tableName: "dwollaPostTransactions",
      timestamps: true,
      paranoid: true,
    }
  );

  return DwollaPostTransactions;
};
