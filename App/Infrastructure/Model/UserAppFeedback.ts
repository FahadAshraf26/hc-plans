export default (sequelize, DataTypes) => {
  const UserAppFeedbackModel = sequelize.define(
    'userAppFeedback',
    {
      userAppFeedbackId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  UserAppFeedbackModel.associate = (models) => {
    models.UserModel.hasMany(UserAppFeedbackModel, {
      foreignKey: 'userId',
      as: 'appFeedbacks',
    });

    UserAppFeedbackModel.belongsTo(models.UserModel, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return UserAppFeedbackModel;
};
