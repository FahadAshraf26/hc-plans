export default (sequelize, DataTypes) => {
  const InvitationModel = sequelize.define(
    'invitation',
    {
      invitationId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      invitee: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      joiningDate: {
        type: DataTypes.DATE,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  return InvitationModel;
};
