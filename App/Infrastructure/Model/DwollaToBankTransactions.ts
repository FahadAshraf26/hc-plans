export default (sequelize, DataTypes) => {
  const DwollaToBankTransactionsModel = sequelize.define(
    'dwollaToBankTransactions',
    {
      dwollaToBankTransactionId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      transferStatus: {
        type: DataTypes.STRING,
      },
      amount: {
        type: DataTypes.FLOAT,
      },
      dwollaTransactionId: {
        type: DataTypes.STRING,
      },
      idempotencyKey: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  DwollaToBankTransactionsModel.associate = (models) => {
    DwollaToBankTransactionsModel.belongsTo(models.UserModel, {
      foreignKey: 'userId',
    });
  };

  return DwollaToBankTransactionsModel;
};
