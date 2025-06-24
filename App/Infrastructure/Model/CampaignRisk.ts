import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class CampaignRisk extends Model {
    // This model does not define any associations itself,
    // so the static 'associate' method is not needed here.
    // The relationship is likely defined in another model (e.g., Campaign.hasMany(CampaignRisk)).
  }

  // Initialize the model with its attributes and options
  CampaignRisk.init(
    {
      // --- Attributes Definition ---
      campaignRiskId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      // --- Model Options ---

      // The Sequelize connection instance
      sequelize,

      // The name of the model
      modelName: "CampaignRisk",

      // Explicitly set the table name. V5 would have also pluralized it to this.
      tableName: "campaignRisks",

      // Enable timestamps (createdAt, updatedAt) and paranoid (deletedAt)
      timestamps: true,
      paranoid: true,
    }
  );

  return CampaignRisk;
};
