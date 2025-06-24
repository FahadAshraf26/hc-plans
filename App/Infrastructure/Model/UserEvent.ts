export default (sequelize, DataTypes) => {
  const UserEventModel = sequelize.define(
    'userEvent',
    {
      userEventId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  UserEventModel.associate = (models) => {
    UserEventModel.belongsTo(UserEventModel, {
      foreignKey: {
        name: 'parentId',
        allowNull: true,
      },
      as: 'parentEvent',
      useJunctionTable: false,
    });

    models.UserModel.hasMany(UserEventModel, {
      foreignKey: 'userId',
      as: 'userEvents',
    });

    UserEventModel.belongsTo(models.UserModel, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return UserEventModel;
};
