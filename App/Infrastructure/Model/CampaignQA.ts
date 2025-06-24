export default (sequelize, DataTypes) => {
  const CampaignQAModel = sequelize.define(
    'campaignQA',
    {
      campaignQAId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  CampaignQAModel.associate = (models) => {
    CampaignQAModel.hasMany(CampaignQAModel, {
      foreignKey: {
        name: 'parentId',
        allowNull: true,
      },
      as: 'children',
      useJunctionTable: false,
    });
  };

  return CampaignQAModel;
};
