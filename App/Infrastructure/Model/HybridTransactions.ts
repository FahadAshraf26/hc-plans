export default (sequelize, DataTypes) => {
  const HybridTransactionModel = sequelize.define(
    'hybridTransaction',
    {
      hybridTransactionId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
      },
      transactionType: {
        type: DataTypes.STRING,
      },
      tradeId: {
        type: DataTypes.STRING,
      },
      refrenceNumber: {
        type: DataTypes.STRING,
      },
      dwollaTransactionId: {
        type: DataTypes.STRING,
      },
      individualACHId: {
        type: DataTypes.STRING,
      },
      applicationFee: {
        type: DataTypes.FLOAT,
      },
      status: {
        type: DataTypes.STRING,
      },
      isSent: {
        type: DataTypes.BOOLEAN,
      },
      walletAmount: {
        type: DataTypes.FLOAT,
      },
      source: {
        type: DataTypes.STRING,
      },
      debitAuthorizationId: {
        type: DataTypes.STRING,
      },
      nachaFileName: {
        type: DataTypes.STRING,
      },
      achRefunded: {
        type: DataTypes.BOOLEAN,
      },
      walletRefunded: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  HybridTransactionModel.associate = (models) => {
    HybridTransactionModel.belongsTo(models.CampaignFundModel, {
      foreignKey: 'campaignFundId',
    });
  };

  return HybridTransactionModel;
};
