import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class DwollaPreBankTransactions extends Model {
    // This model does not define any associations itself,
    // so the static 'associate' method is not needed here.
    // Relationships to this model are defined in other models.
  }

  // Initialize the model with its attributes and options
  DwollaPreBankTransactions.init(
    {
      // --- Attributes Definition ---
      dwollaPreBankTransactionId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      uploadId: {
        type: DataTypes.STRING,
      },
      source: {
        type: DataTypes.STRING,
      },
      destination: {
        type: DataTypes.STRING,
      },
      issuerName: {
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
      status: {
        type: DataTypes.STRING,
      },
      errorMessage: {
        type: DataTypes.STRING,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "DwollaPreBankTransactions",
      tableName: "dwollaPreBankTransactions",
      timestamps: true,
      paranoid: true,
    }
  );

  return DwollaPreBankTransactions;
};
