export default (sequelize, DataTypes) => {
  const CampaignQAReportModel = sequelize.define(
    'campaignQAReport',
    {
      campaignQAReportId: {
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

  CampaignQAReportModel.associate = (models) => {
    models.CampaignQAModel.hasMany(CampaignQAReportModel, {
      foreignKey: 'campaignQAId',
      as: 'reports',
    });

    CampaignQAReportModel.belongsTo(models.CampaignQAModel, {
      foreignKey: 'campaignQAId',
      as: 'question',
    });

    models.UserModel.hasMany(CampaignQAReportModel, {
      foreignKey: 'userId',
      as: 'reportedQuestions',
    });

    CampaignQAReportModel.belongsTo(models.UserModel, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return CampaignQAReportModel;
};
