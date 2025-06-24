import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class EmployeeLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of the Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Note: `EmployeeLogModel` is replaced with `this`, and
      // `IssuerModel` is updated to its v6 class name.
      this.belongsTo(models.Issuer, {
        foreignKey: "issuerId",
      });
    }
  }

  // Initialize the model with its attributes and options
  EmployeeLog.init(
    {
      // --- Attributes Definition ---
      employeeLogId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      employeeCount: {
        type: DataTypes.INTEGER,
      },
      updatedEmployeeCount: {
        type: DataTypes.INTEGER,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "EmployeeLog",
      tableName: "employeeLogs", // Explicitly set table name
      timestamps: true,
      paranoid: true,
    }
  );

  return EmployeeLog;
};
