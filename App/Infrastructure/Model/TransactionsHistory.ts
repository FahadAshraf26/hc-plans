export default (sequelize, DataTypes) => {
  const TransactionsHistory = sequelize.define(
    'transactionsHistory',
    {
      transactionsHistoryId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      cashFlowStatus: {
        type: DataTypes.STRING,
      },
      dwollaTransferId: {
        type: DataTypes.STRING,
      },
      campaignName: {
        type: DataTypes.STRING,
      },
      userId: {
        type: DataTypes.STRING,
      },
      amount: {
        type: DataTypes.FLOAT,
      },
      transferStatus: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  return TransactionsHistory;
};
