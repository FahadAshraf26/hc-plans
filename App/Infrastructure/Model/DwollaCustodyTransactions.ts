export default (sequelize, DataTypes) => {
  const DwollaCustodyTransactionsModel = sequelize.define(
    'dwollaCustodyTransactions',
    {
      dwollaCustodyTransactionId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      source: {
        type: DataTypes.STRING,
      },
      destination: {
        type: DataTypes.STRING,
      },
      notCompletedStatus: {
        type: DataTypes.STRING,
      },
      completedStatus: {
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
      isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      failureCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      failureReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  DwollaCustodyTransactionsModel.associate = (models) => {
    DwollaCustodyTransactionsModel.belongsTo(models.IssuerModel, {
      foreignKey: 'issuerId',
    });

    DwollaCustodyTransactionsModel.belongsTo(models.DwollaPreBankTransactionsModel, {
      foreignKey: 'dwollaPreBankTransactionId',
    });
  };

  return DwollaCustodyTransactionsModel;
};
