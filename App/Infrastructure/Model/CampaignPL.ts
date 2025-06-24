export default (sequelize, DataTypes) => {
  const PLModel = sequelize.define(
    'PL',
    {
      plId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      pl: {
        type: DataTypes.JSON,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  return PLModel;
};
