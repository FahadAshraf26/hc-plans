export default (sequelize, DataTypes) => {
  const RepaymentsUpdateModel = sequelize.define(
    'repaymentsUpdate',
    {
      repaymentsUpdateId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  return RepaymentsUpdateModel;
};
