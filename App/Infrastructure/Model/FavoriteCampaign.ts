import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class FavoriteCampaign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of the Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Note: `FavoriteCampaignModel` is replaced with `this`, and
      // the associated model names are updated to their v6 class names.
      this.belongsTo(models.Campaign, {
        foreignKey: "campaignId",
      });
      this.belongsTo(models.Investor, {
        foreignKey: "investorId",
      });
    }
  }

  // Initialize the model with its attributes and options
  FavoriteCampaign.init(
    {
      // --- Attributes Definition ---
      favoriteCampaignId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      // Foreign keys for 'campaignId' and 'investorId' will be added automatically
      // by the associations defined above.
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "FavoriteCampaign",
      tableName: "favoriteCampaigns", // Explicitly set table name
      timestamps: true,
      paranoid: true,
    }
  );

  return FavoriteCampaign;
};
