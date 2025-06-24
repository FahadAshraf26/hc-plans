export default (sequelize, DataTypes) => {
  const DwollaFundingSourceVerificationModel = sequelize.define(
    'dwollaFundingSourceVerification',
    {
      dwollaFundingSourceVerificationId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      isMicroDepositInitiated: {
        type: DataTypes.BOOLEAN,
      },
      microDepositInitiatedAt: {
        type: DataTypes.DATE,
      },
      firstTransactionAmount: {
        type: DataTypes.FLOAT,
      },
      secondTransactionAmount: {
        type: DataTypes.FLOAT,
      },
      isFundingSourceVerified: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  DwollaFundingSourceVerificationModel.associate = (models) => {
    DwollaFundingSourceVerificationModel.belongsTo(models.IssuerBankModel, {
      foreignKey: 'dwollaSourceId',
    });
  };

  return DwollaFundingSourceVerificationModel;
};
