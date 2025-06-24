import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class DwollaPreTransactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of the Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Note: `DwollaPreTransactionsModel` is replaced with `this`, and
      // `DwollaPostTransactionsModel` is updated to its v6 class name.
      this.hasMany(models.DwollaPostTransactions, {
        foreignKey: "dwollaPreTransactionId",
      });
    }
  }

  // Initialize the model with its attributes and options
  DwollaPreTransactions.init(
    {
      // --- Attributes Definition ---
      dwollaPreTransactionId: {
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
      issuerName: {
        type: DataTypes.STRING,
      },
      campaignName: {
        type: DataTypes.STRING,
      },
      issuerEmail: {
        type: DataTypes.STRING,
      },
      investorName: {
        type: DataTypes.STRING,
      },
      investorEmail: {
        type: DataTypes.STRING,
      },
      investorType: {
        type: DataTypes.STRING,
      },
      entityName: {
        type: DataTypes.STRING,
      },
      uploadId: {
        type: DataTypes.STRING,
      },
      errorMessage: {
        type: DataTypes.JSON,
      },
      fileName: {
        type: DataTypes.STRING,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "DwollaPreTransactions",
      tableName: "dwollaPreTransactions",
      timestamps: true,
      paranoid: true,
    }
  );

  return DwollaPreTransactions;
};
