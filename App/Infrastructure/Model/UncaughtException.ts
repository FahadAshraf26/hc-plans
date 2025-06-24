export default (sequelize, DataTypes) => {
  const UncaughtExceptionModel = sequelize.define(
    'uncaughtException',
    {
      uncaughtExceptionId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      data: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  return UncaughtExceptionModel;
};
