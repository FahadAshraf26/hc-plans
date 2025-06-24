import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class DwollaToBankTransactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of the Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Note: `DwollaToBankTransactionsModel` is replaced with `this`, and
      // `UserModel` is updated to its v6 class name.
      this.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }

  // Initialize the model with its attributes and options
  DwollaToBankTransactions.init(
    {
      // --- Attributes Definition ---
      dwollaToBankTransactionId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      transferStatus: {
        type: DataTypes.STRING,
      },
      amount: {
        type: DataTypes.FLOAT,
      },
      dwollaTransactionId: {
        type: DataTypes.STRING,
      },
      idempotencyKey: {
        type: DataTypes.STRING,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "DwollaToBankTransactions",
      tableName: "dwollaToBankTransactions",
      timestamps: true,
      paranoid: true,
    }
  );

  return DwollaToBankTransactions;
};
