export default (sequelize, DataTypes) => {
  const CampaignMediaModel = sequelize.define(
    'campaignMedia',
    {
      campaignMediaId: {
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
      position: {
        type: DataTypes.INTEGER,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  return CampaignMediaModel;
};
