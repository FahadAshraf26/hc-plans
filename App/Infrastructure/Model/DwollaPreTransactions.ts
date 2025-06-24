export default (sequelize, DataTypes) => {
  const DwollaPreTransactionsModel = sequelize.define(
    'dwollaPreTransactions',
    {
      dwollaPreTransactionId: {
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
      issuerName: {
        type: DataTypes.STRING,
      },
      campaignName: {
        type: DataTypes.STRING,
      },
      issuerEmail: {
        type: DataTypes.STRING,
      },
      investorName: {
        type: DataTypes.STRING,
      },
      investorEmail: {
        type: DataTypes.STRING,
      },
      investorType: {
        type: DataTypes.STRING,
      },
      entityName: {
        type: DataTypes.STRING,
      },
      uploadId: {
        type: DataTypes.STRING,
      },
      errorMessage: {
        type: DataTypes.JSON,
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

  DwollaPreTransactionsModel.associate = (models) => {
    DwollaPreTransactionsModel.hasMany(models.DwollaPostTransactionsModel, {
      foreignKey: 'dwollaPreTransactionId',
    });
  };

  return DwollaPreTransactionsModel;
};
