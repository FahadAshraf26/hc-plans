export default (sequelize, DataTypes) => {
  const CampaignOfferingChangeModel = sequelize.define(
    'campaignOfferingChange',
    {
      campaignOfferingChangeId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      campaignId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      investorId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reconfirmed: {
        type: DataTypes.TINYINT,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );
  return CampaignOfferingChangeModel;
};
