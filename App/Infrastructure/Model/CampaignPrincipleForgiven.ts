export default (sequelize, DataTypes) => {
  const CampaignPrincipleForgivenModel = sequelize.define(
    'campaignPrincipleForgiven',
    {
      campaignPrincipleForgivenId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      principleForgivenAmount: {
        type: DataTypes.FLOAT,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  CampaignPrincipleForgivenModel.associate = (models) => {
    CampaignPrincipleForgivenModel.belongsTo(models.CampaignModel, {
      foreignKey: 'campaignId',
      as: "campaignPrincipleForgiven"
    });
    CampaignPrincipleForgivenModel.belongsTo(models.InvestorModel, {
      foreignKey: 'investorId',
    });
  };

  return CampaignPrincipleForgivenModel;
};
