import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class CampaignOwnerStory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of the Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Note: All `...Model` suffixes have been removed from the model names
      // and `CampaignOwnerStoryModel` is replaced with `this` to refer to the current class.

      // Defines the relationship from the perspective of the other model
      models.Campaign.hasOne(this, {
        foreignKey: "campaignId",
        as: "ownerStory",
      });

      // Defines the relationship from this model's perspective
      this.belongsTo(models.Campaign, {
        foreignKey: "campaignId",
        as: "campaign",
      });
    }
  }

  // Initialize the model with its attributes and options
  CampaignOwnerStory.init(
    {
      // --- Attributes Definition ---
      campaignOwnerStoryId: {
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
      mediaUri: {
        type: DataTypes.STRING,
      },
    },
    {
      // --- Model Options ---

      // The Sequelize connection instance
      sequelize,

      // The name of the model
      modelName: "CampaignOwnerStory",

      // Explicitly set the table name. V5 would have also pluralized it to this.
      tableName: "campaignOwnerStories",

      // Enable timestamps (createdAt, updatedAt) and paranoid (deletedAt)
      timestamps: true,
      paranoid: true,
    }
  );

  return CampaignOwnerStory;
};
