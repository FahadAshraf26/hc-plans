export default (sequelize, DataTypes) => {
  const CampaignNewsModel = sequelize.define(
    'campaignNews',
    {
      campaignNewsId: {
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
      hyperLink: {
        type: DataTypes.STRING,
      },
      hyperLinkText: {
        type: DataTypes.TEXT,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  CampaignNewsModel.associate = (models) => {
    CampaignNewsModel.hasMany(models.CampaignNotificationModel, {
      foreignKey: 'campaignNewsId',
      as: 'campaignNews',
    });
  };

  return CampaignNewsModel;
};
