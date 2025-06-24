export default (sequelize, DataTypes) => {
  const RoughBudgetModel = sequelize.define(
    'roughBudget',
    {
      roughBudgetId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      roughBudget: {
        type: DataTypes.JSON,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  return RoughBudgetModel;
};
