export default (sequelize, DataTypes) => {
  const CampaignNotificationModel = sequelize.define(
    'campaignNotification',
    {
      campaignNotificationId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      isSeen: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  CampaignNotificationModel.associate = (model) => {
    CampaignNotificationModel.belongsTo(model.CampaignModel, {
      foreignKey: 'campaignId',
      as: 'campaign',
    });

    CampaignNotificationModel.belongsTo(model.InvestorModel, {
      foreignKey: 'investorId',
    });

    CampaignNotificationModel.belongsTo(model.CampaignNewsModel, {
      foreignKey: 'campaignNewsId',
      as: "campaignNews"
    });
  };

  return CampaignNotificationModel;
};
