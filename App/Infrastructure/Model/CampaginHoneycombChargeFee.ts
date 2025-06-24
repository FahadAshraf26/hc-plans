import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class CampaignHoneycombChargeFee extends Model {
    // No associations are defined for this model, so the static 'associate' method is not needed.
  }

  // Initialize the model with its attributes and options
  CampaignHoneycombChargeFee.init(
    {
      // --- Attributes Definition ---
      campaignHoneycombChargeFeeId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      isChargeFee: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      // --- Model Options ---

      // The Sequelize connection instance
      sequelize,

      // The name of the model
      modelName: "CampaignHoneycombChargeFee",

      // Explicitly set the table name. V5 would have also pluralized it to this.
      tableName: "campaignHoneycombChargeFees",

      // Enable timestamps (createdAt, updatedAt) and paranoid (deletedAt)
      timestamps: true,
      paranoid: true,
    }
  );

  return CampaignHoneycombChargeFee;
};
