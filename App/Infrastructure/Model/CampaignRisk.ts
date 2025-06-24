export default (sequelize, DataTypes) => {
  const CampaignRiskModel = sequelize.define(
    'campaignRisk',
    {
      campaignRiskId: {
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
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );
  return CampaignRiskModel;
};
