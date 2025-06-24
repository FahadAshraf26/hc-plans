export default (sequelize, DataTypes) => {
  const IdologyTimestampModel = sequelize.define(
    'idologyTimestamp',
    {
      idologyTimestampId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isVerified: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      idologyIdNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      idologyScanUrl: {
        type: DataTypes.STRING,
      },
      idologyScanUrlExpirationTime: {
        type: DataTypes.DATE,
      },
      isResultMatched: {
        type: DataTypes.BOOLEAN,
      },
      badActorFlagged: {
        type: DataTypes.BOOLEAN,
      },
      ncResponse: {
        type: DataTypes.JSON,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  IdologyTimestampModel.associate = (models) => {
    models.UserModel.hasMany(IdologyTimestampModel, {
      foreignKey: 'userId',
      as: 'idologyTimestamps',
    });

    IdologyTimestampModel.belongsTo(models.UserModel, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return IdologyTimestampModel;
};
