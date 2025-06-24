export default (sequelize, DataTypes) => {
  const DwollaCustodyTransferHistoryModel = sequelize.define(
    'dwollaCustodyTransferHistory',
    {
      dwollaCustodyTransferHistoryId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      source: {
        type: DataTypes.STRING,
      },
      destination: {
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

  DwollaCustodyTransferHistoryModel.associate = (models) => {
    DwollaCustodyTransferHistoryModel.belongsTo(models.IssuerModel, {
      foreignKey: 'issuerId',
      constraints: false,
    });

    DwollaCustodyTransferHistoryModel.hasMany(models.DwollaPostBankTransactionsModel, {
      foreignKey: 'dwollaCustodyTransferHistoryId',
      constraints: false,
    });
  };

  return DwollaCustodyTransferHistoryModel;
};
