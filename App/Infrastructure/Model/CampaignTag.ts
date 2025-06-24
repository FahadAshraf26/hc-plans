export default (sequelize, DataTypes) => {
  const CampaignTagModel = sequelize.define(
    'campaignTag',
    {
      campaignTagId: {
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

  return CampaignTagModel;
};
