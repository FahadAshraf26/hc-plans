import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class CampaignAddress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of the Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Define the 'belongsTo' association
      // Note: The target model is now 'models.Campaign' to match v6 naming conventions.
      this.belongsTo(models.Campaign, {
        foreignKey: "campaignId",
        as: "campaign",
      });
    }
  }

  // Initialize the model with its attributes and options
  CampaignAddress.init(
    {
      // --- Attributes Definition ---
      campaignAddressId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      // Shorthand attributes expanded for consistency
      address: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
      },
      state: {
        type: DataTypes.STRING,
      },
      zipCode: {
        type: DataTypes.STRING,
      },
      latitude: {
        type: DataTypes.STRING,
      },
      longitude: {
        type: DataTypes.STRING,
      },
    },
    {
      // --- Model Options ---

      // The Sequelize connection instance
      sequelize,

      // The name of the model
      modelName: "CampaignAddress",

      // Explicitly set the table name. V5 would have also pluralized it to this name.
      tableName: "campaignAddresses",

      // Enable timestamps (createdAt, updatedAt)
      timestamps: true,

      // paranoid: false is the default, so it does not need to be specified.
    }
  );

  return CampaignAddress;
};
