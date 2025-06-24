export default (sequelize, DataTypes) => {
  const CampaignOwnerStoryModel = sequelize.define(
    'campaignOwnerStory',
    {
      campaignOwnerStoryId: {
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
      mediaUri: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  CampaignOwnerStoryModel.associate = (models) => {
    models.CampaignModel.hasOne(CampaignOwnerStoryModel, {
      foreignKey: 'campaignId',
      as: 'ownerStory',
    });

    CampaignOwnerStoryModel.belongsTo(models.CampaignModel, {
      foreignKey: 'campaignId',
      as: 'campaign',
    });
  };

  return CampaignOwnerStoryModel;
};
