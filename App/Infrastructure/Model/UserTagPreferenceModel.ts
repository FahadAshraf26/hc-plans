export default (sequelize, DataTypes) => {
  const UserTagPreferenceModel = sequelize.define(
    'userTagPreference',
    {
      userTagPreferenceId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'users',
          key: 'userId',
        },
      },
      tagId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'tags',
          key: 'tagId',
        },
      },
    },
    {
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          unique: true,
          fields: ['userId', 'tagId'], // Prevent duplicate user-tag combinations
        },
        {
          fields: ['userId'], // Index for faster user lookups
        },
        {
          fields: ['tagId'], // Index for faster tag lookups
        },
      ],
    },
  );

  UserTagPreferenceModel.associate = (models) => {
    UserTagPreferenceModel.belongsTo(models.UserModel, {
      foreignKey: 'userId',
      as: 'user',
    });

    UserTagPreferenceModel.belongsTo(models.TagModel, {
      foreignKey: 'tagId',
      as: 'tag',
    });
  };

  return UserTagPreferenceModel;
};
