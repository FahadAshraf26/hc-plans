export default (sequelize, DataTypes) => {
  const DwollaPostTransactionsModel = sequelize.define(
    'dwollaPostTransactions',
    {
      dwollaPostTransactionId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      source: {
        type: DataTypes.STRING,
      },
      destination: {
        type: DataTypes.STRING,
      },
      interestPaid: {
        type: DataTypes.FLOAT,
      },
      principalPaid: {
        type: DataTypes.FLOAT,
      },
      total: {
        type: DataTypes.FLOAT,
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
      fileName: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  DwollaPostTransactionsModel.associate = (models) => {
    DwollaPostTransactionsModel.belongsTo(models.IssuerModel, {
      foreignKey: 'issuerId',
    });

    DwollaPostTransactionsModel.belongsTo(models.DwollaPreTransactionsModel, {
      foreignKey: 'dwollaPreTransactionId',
    });
  };

  return DwollaPostTransactionsModel;
};
