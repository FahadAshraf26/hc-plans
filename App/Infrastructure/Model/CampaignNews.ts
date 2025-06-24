import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class CampaignNews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of the Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Define the 'hasMany' association
      // Note: The target model is now 'models.CampaignNotification' to match v6 naming conventions.
      this.hasMany(models.CampaignNotification, {
        foreignKey: "campaignNewsId",
        as: "campaignNews",
      });
    }
  }

  // Initialize the model with its attributes and options
  CampaignNews.init(
    {
      // --- Attributes Definition ---
      campaignNewsId: {
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
      hyperLink: {
        type: DataTypes.STRING,
      },
      hyperLinkText: {
        type: DataTypes.TEXT,
      },
    },
    {
      // --- Model Options ---

      // The Sequelize connection instance
      sequelize,

      // The name of the model
      modelName: "CampaignNews",

      // Explicitly set the table name. V5 would have also pluralized it to this.
      tableName: "campaignNews", // 'News' is both singular and plural.

      // Enable timestamps (createdAt, updatedAt) and paranoid (deletedAt)
      timestamps: true,
      paranoid: true,
    }
  );

  return CampaignNews;
};
