export default (sequelize, DataTypes) => {
  const DwollaPostBankTransactionsModel = sequelize.define(
    'dwollaPostBankTransactions',
    {
      dwollaPostBankTransactionId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      source: {
        type: DataTypes.STRING,
      },
      destination: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
      },
      idempotencyId: {
        type: DataTypes.STRING,
      },
      dwollaTransferId: {
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
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  DwollaPostBankTransactionsModel.associate = (models) => {
    DwollaPostBankTransactionsModel.belongsTo(models.IssuerModel, {
      foreignKey: 'issuerId',
    });

    DwollaPostBankTransactionsModel.belongsTo(models.DwollaPreBankTransactionsModel, {
      foreignKey: 'dwollaPreBankTransactionId',
    });

    DwollaPostBankTransactionsModel.belongsTo(models.DwollaCustodyTransferHistoryModel, {
      foreignKey: 'dwollaCustodyTransferHistoryId',
      constraints: false,
    });
  };

  return DwollaPostBankTransactionsModel;
};
