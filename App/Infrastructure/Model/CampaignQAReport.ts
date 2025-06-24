import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class CampaignQAReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of the Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Note: All `...Model` suffixes have been removed from the model names
      // and `CampaignQAReportModel` is replaced with `this` to refer to the current class.

      // Defines the relationship from the perspective of other models
      models.CampaignQA.hasMany(this, {
        foreignKey: "campaignQAId",
        as: "reports",
      });

      // Defines the relationship from this model's perspective
      this.belongsTo(models.CampaignQA, {
        foreignKey: "campaignQAId",
        as: "question",
      });

      models.User.hasMany(this, {
        foreignKey: "userId",
        as: "reportedQuestions",
      });

      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }

  // Initialize the model with its attributes and options
  CampaignQAReport.init(
    {
      // --- Attributes Definition ---
      campaignQAReportId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      // --- Model Options ---

      // The Sequelize connection instance
      sequelize,

      // The name of the model
      modelName: "CampaignQAReport",

      // Explicitly set the table name. V5 would have also pluralized it to this.
      tableName: "campaignQAReports",

      // Enable timestamps (createdAt, updatedAt) and paranoid (deletedAt)
      timestamps: true,
      paranoid: true,
    }
  );

  return CampaignQAReport;
};
