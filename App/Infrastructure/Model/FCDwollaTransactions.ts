export default (sequelize, DataTypes) => {
  const FCDwollaTransactionsModel = sequelize.define(
    'FCDwollaTransactions',
    {
      fcDwollaTransactionsId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      status: {
        type: DataTypes.STRING,
      },
      amount: {
        type: DataTypes.FLOAT,
      },
      requestedBy: {
        type: DataTypes.STRING,
      },
      dwollaTransactionId: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  return FCDwollaTransactionsModel;
};
