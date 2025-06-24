import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class CampaignInfo extends Model {
    // This model does not define any associations itself,
    // so the static 'associate' method is not needed here.
    // The relationship (e.g., Campaign.hasOne(CampaignInfo)) is defined in the Campaign model.
  }

  // Initialize the model with its attributes and options
  CampaignInfo.init(
    {
      // --- Attributes Definition ---
      campaignInfoId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      financialHistory: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      competitors: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      milestones: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      investorPitch: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      risks: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      target: {
        type: DataTypes.JSON,
      },
      isShowPitch: {
        type: DataTypes.BOOLEAN,
      },
      investorPitchTitle: {
        type: DataTypes.STRING,
        defaultValue: "Investor Pitch",
      },
    },
    {
      // --- Model Options ---

      // The Sequelize connection instance
      sequelize,

      // The name of the model
      modelName: "CampaignInfo",

      // Explicitly set the table name. V5 would have also pluralized it to this.
      tableName: "campaignInfos",

      // Enable timestamps (createdAt, updatedAt) and paranoid (deletedAt)
      timestamps: true,
      paranoid: true,
    }
  );

  return CampaignInfo;
};
