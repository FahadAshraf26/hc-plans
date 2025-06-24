export default (sequelize, DataTypes) => {
  const CampaignNewsReportModel = sequelize.define(
    'campaignNewsReport',
    {
      campaignNewsReportId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  CampaignNewsReportModel.associate = (models) => {
    models.CampaignNewsModel.hasMany(CampaignNewsReportModel, {
      foreignKey: 'campaignNewsId',
      as: 'reports',
    });

    CampaignNewsReportModel.belongsTo(models.CampaignNewsModel, {
      foreignKey: 'campaignNewsId',
      as: 'question',
    });

    models.UserModel.hasMany(CampaignNewsReportModel, {
      foreignKey: 'userId',
      as: 'reportedUpdates',
    });

    CampaignNewsReportModel.belongsTo(models.UserModel, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return CampaignNewsReportModel;
};
