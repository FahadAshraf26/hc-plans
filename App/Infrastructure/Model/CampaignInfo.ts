export default (sequelize, DataTypes) => {
  const CampaignInfoModel = sequelize.define(
    'campaignInfo',
    {
      campaignInfoId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      financialHistory: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      competitors: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      milestones: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      investorPitch: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      risks: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      target: {
        type: DataTypes.JSON,
      },
      isShowPitch: {
        type: DataTypes.BOOLEAN,
      },
      investorPitchTitle: {
        type: DataTypes.STRING,
        defaultValue: 'Investor Pitch',
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  return CampaignInfoModel;
};
