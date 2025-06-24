import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class CampaignNotification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of the Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Note: All `...Model` suffixes have been removed from the model names
      // and `CampaignNotificationModel` is replaced with `this` to refer to the current class.

      this.belongsTo(models.Campaign, {
        foreignKey: "campaignId",
        as: "campaign",
      });

      this.belongsTo(models.Investor, {
        foreignKey: "investorId",
      });

      this.belongsTo(models.CampaignNews, {
        foreignKey: "campaignNewsId",
        as: "campaignNews",
      });
    }
  }

  // Initialize the model with its attributes and options
  CampaignNotification.init(
    {
      // --- Attributes Definition ---
      campaignNotificationId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      isSeen: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      // --- Model Options ---

      // The Sequelize connection instance
      sequelize,

      // The name of the model
      modelName: "CampaignNotification",

      // Explicitly set the table name. V5 would have also pluralized it to this.
      tableName: "campaignNotifications",

      // Enable timestamps (createdAt, updatedAt) and paranoid (deletedAt)
      timestamps: true,
      paranoid: true,
    }
  );

  return CampaignNotification;
};
