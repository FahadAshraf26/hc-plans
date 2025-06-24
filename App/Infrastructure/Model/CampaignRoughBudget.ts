import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class RoughBudget extends Model {
    // This model does not define any associations itself,
    // so the static 'associate' method is not needed here.
    // The relationship is likely defined in another model (e.g., Campaign.hasMany(RoughBudget)).
  }

  // Initialize the model with its attributes and options
  RoughBudget.init(
    {
      // --- Attributes Definition ---
      roughBudgetId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      roughBudget: {
        type: DataTypes.JSON,
      },
    },
    {
      // --- Model Options ---

      // The Sequelize connection instance
      sequelize,

      // The name of the model
      modelName: "RoughBudget",

      // Explicitly set the table name. V5 would have also pluralized it to this.
      tableName: "roughBudgets",

      // Enable timestamps (createdAt, updatedAt) and paranoid (deletedAt)
      timestamps: true,
      paranoid: true,
    }
  );

  return RoughBudget;
};
