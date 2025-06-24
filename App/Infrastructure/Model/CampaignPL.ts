import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class. Using 'PL' as the class name is fine.
  class PL extends Model {
    // This model does not define any associations itself,
    // so the static 'associate' method is not needed here.
    // The relationship is likely defined in another model (e.g., Campaign.hasMany(PL)).
  }

  // Initialize the model with its attributes and options
  PL.init(
    {
      // --- Attributes Definition ---
      plId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      pl: {
        type: DataTypes.JSON,
      },
    },
    {
      // --- Model Options ---

      // The Sequelize connection instance
      sequelize,

      // The name of the model
      modelName: "PL",

      // Explicitly set the table name. V5 would have pluralized it to 'PLs'.
      tableName: "PLs",

      // Enable timestamps (createdAt, updatedAt) and paranoid (deletedAt)
      timestamps: true,
      paranoid: true,
    }
  );

  return PL;
};
