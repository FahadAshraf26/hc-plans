export default (sequelize, DataTypes) => {
  const DwollaPreBankTransactionsModel = sequelize.define(
    'dwollaPreBankTransactions',
    {
      dwollaPreBankTransactionId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      uploadId: {
        type: DataTypes.STRING,
      },
      source: {
        type: DataTypes.STRING,
      },
      destination: {
        type: DataTypes.STRING,
      },
      issuerName: {
        type: DataTypes.STRING,
      },
      businessOwnerName: {
        type: DataTypes.STRING,
      },
      businessOwnerEmail: {
        type: DataTypes.STRING,
      },
      amount: {
        type: DataTypes.FLOAT,
      },
      status: {
        type: DataTypes.STRING,
      },
      errorMessage: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  return DwollaPreBankTransactionsModel;
};
