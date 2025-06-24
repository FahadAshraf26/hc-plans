import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class CampaignDocument extends Model {
    // This model does not define any associations itself,
    // so the static 'associate' method is not needed here.
    // The relationship is likely defined in another model (e.g., Campaign.hasMany(CampaignDocument)).
  }

  // Initialize the model with its attributes and options
  CampaignDocument.init(
    {
      // --- Attributes Definition ---
      campaignDocumentId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      documentType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mimeType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ext: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      // --- Model Options ---

      // The Sequelize connection instance
      sequelize,

      // The name of the model
      modelName: "CampaignDocument",

      // Explicitly set the table name. V5 would have also pluralized it to this.
      tableName: "campaignDocuments",

      // Enable timestamps (createdAt, updatedAt) and paranoid (deletedAt)
      timestamps: true,
      paranoid: true,
    }
  );

  return CampaignDocument;
};
