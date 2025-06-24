import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class DwollaWebhook extends Model {
    // This model does not define any associations itself,
    // so the static 'associate' method is not needed here.
  }

  // Initialize the model with its attributes and options
  DwollaWebhook.init(
    {
      // --- Attributes Definition ---
      dwollaWebhookId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      eventId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      topic: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      resourceId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      // --- Model Options ---

      // The Sequelize connection instance
      sequelize,

      // The name of the model
      modelName: "DwollaWebhook",

      // Explicitly set the table name. V5 would have pluralized it to 'dwollaWebhooks'.
      tableName: "dwollaWebhooks",

      // Enable timestamps (createdAt, updatedAt)
      timestamps: true,

      // paranoid: false is the default, so it does not need to be specified.
    }
  );

  return DwollaWebhook;
};
