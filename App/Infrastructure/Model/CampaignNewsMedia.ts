export default (sequelize, DataTypes) => {
  const CampaignNewsMediaModel = sequelize.define(
    'campaignNewsMedia',
    {
      campaignNewsMediaId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      originalPath: {
        type: DataTypes.STRING,
      },
      mimeType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  return CampaignNewsMediaModel;
};
