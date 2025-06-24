export default (sequelize, DataTypes) => {
  const FavoriteCampaignModel = sequelize.define(
    'favoriteCampaign',
    {
      favoriteCampaignId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );
  FavoriteCampaignModel.associate = (models) => {
    FavoriteCampaignModel.belongsTo(models.CampaignModel, {
      foreignKey: 'campaignId',
    });
    FavoriteCampaignModel.belongsTo(models.InvestorModel, {
      foreignKey: 'investorId',
    });
  };
  return FavoriteCampaignModel;
};
