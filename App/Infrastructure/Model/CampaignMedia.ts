import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class CampaignMedia extends Model {
    // This model does not define any associations itself,
    // so the static 'associate' method is not needed here.
    // The relationship is likely defined in another model (e.g., Campaign.hasMany(CampaignMedia)).
  }

  // Initialize the model with its attributes and options
  CampaignMedia.init(
    {
      // --- Attributes Definition ---
      campaignMediaId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      originalPath: {
        type: DataTypes.STRING,
      },
      mimeType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      position: {
        type: DataTypes.INTEGER,
      },
    },
    {
      // --- Model Options ---

      // The Sequelize connection instance
      sequelize,

      // The name of the model
      modelName: "CampaignMedia",

      // Explicitly set the table name. V5 would have also pluralized it to this.
      tableName: "campaignMedia", // Note: 'media' is often treated as both singular and plural.

      // Enable timestamps (createdAt, updatedAt) and paranoid (deletedAt)
      timestamps: true,
      paranoid: true,
    }
  );

  return CampaignMedia;
};
