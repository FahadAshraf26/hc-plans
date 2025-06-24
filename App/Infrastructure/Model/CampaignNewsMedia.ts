import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class CampaignNewsMedia extends Model {
    // This model does not define any associations itself,
    // so the static 'associate' method is not needed here.
    // The relationship is likely defined in another model (e.g., CampaignNews.hasMany(CampaignNewsMedia)).
  }

  // Initialize the model with its attributes and options
  CampaignNewsMedia.init(
    {
      // --- Attributes Definition ---
      campaignNewsMediaId: {
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
    },
    {
      // --- Model Options ---

      // The Sequelize connection instance
      sequelize,

      // The name of the model
      modelName: "CampaignNewsMedia",

      // Explicitly set the table name. V5 would have also pluralized it to this.
      tableName: "campaignNewsMedia", // 'Media' is often treated as both singular and plural.

      // Enable timestamps (createdAt, updatedAt) and paranoid (deletedAt)
      timestamps: true,
      paranoid: true,
    }
  );

  return CampaignNewsMedia;
};
