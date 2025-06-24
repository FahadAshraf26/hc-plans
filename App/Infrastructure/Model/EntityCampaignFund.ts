export default (sequelize, DataTypes) => {
  const EntityCampaignFundModel = sequelize.define(
    'entityCampaignFund',
    {
      entityCampaignFundId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );
  EntityCampaignFundModel.associate = ({ CampaignFundModel, IssuerModel }) => {
    EntityCampaignFundModel.belongsTo(CampaignFundModel, {
      foreignKey: 'campaignFundId',
    });
    EntityCampaignFundModel.belongsTo(IssuerModel, {
      foreignKey: 'entityId',
    });
  };
  return EntityCampaignFundModel;
};
