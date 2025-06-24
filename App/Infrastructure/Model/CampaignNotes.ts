export default (sequelize, DataTypes) => {
  const CampaignNotesModel = sequelize.define(
    'campaignNotes',
    {
      campaignNotesId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  return CampaignNotesModel;
};
