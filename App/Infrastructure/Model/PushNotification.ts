export default (sequelize, DataTypes) => {
  const PushNotificationModel = sequelize.define(
    'pushNotification',
    {
      pushNotificationId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      data: {
        type: DataTypes.JSON,
      },
      expoNotificationId: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
      },
      visited: {
        type: DataTypes.BOOLEAN,
      },
      resourceType: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  PushNotificationModel.associate = (models) => {
    models.UserModel.hasMany(PushNotificationModel, {
      foreignKey: 'userId',
      as: 'notifications',
    });

    PushNotificationModel.belongsTo(models.UserModel, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return PushNotificationModel;
};
