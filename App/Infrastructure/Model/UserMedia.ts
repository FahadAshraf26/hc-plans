export default (sequelize, DataTypes) => {
  const UserMediaModel = sequelize.define(
    'userMedia',
    {
      userMediaId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      uri: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tinyUri: {
        type: DataTypes.STRING,
      },
      mimeType: {
        type: DataTypes.STRING,
      },
      dwollaDocumentId: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  return UserMediaModel;
};
