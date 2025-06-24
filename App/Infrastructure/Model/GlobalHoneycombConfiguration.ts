import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class GlobalHoneycombConfiguration extends Model {
    // This model does not define any associations itself,
    // so the static 'associate' method is not needed here.
  }

  // Initialize the model with its attributes and options
  GlobalHoneycombConfiguration.init(
    {
      // --- Attributes Definition ---
      globalHoneycombConfigurationId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      configuration: {
        type: DataTypes.JSON,
      },
    },
    {
      // --- Model Options ---

      // The Sequelize connection instance
      sequelize,

      // The name of the model
      modelName: "GlobalHoneycombConfiguration",

      // Explicitly set the table name. V5 would have also pluralized it to this.
      tableName: "globalHoneycombConfigurations",

      // Enable timestamps (createdAt, updatedAt) and paranoid (deletedAt)
      timestamps: true,
      paranoid: true,
    }
  );

  return GlobalHoneycombConfiguration;
};
