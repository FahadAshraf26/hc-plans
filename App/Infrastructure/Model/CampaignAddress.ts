export default (sequelize, DataTypes) => {
  const CampaignAddressModel = sequelize.define(
    'campaignAddress',
    {
      campaignAddressId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      zipCode: DataTypes.STRING,
      latitude: DataTypes.STRING,
      longitude: DataTypes.STRING,
    },
    {
      timestamps: true,
    },
  );

  CampaignAddressModel.associate = (models) => {
    // Campaign
    CampaignAddressModel.belongsTo(models.CampaignModel, {
      foreignKey: 'campaignId',
      as: 'campaign',
    });
  };

  return CampaignAddressModel;
};
