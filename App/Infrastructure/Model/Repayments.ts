export default (sequelize, DataTypes) => {
  const RepaymentModel = sequelize.define(
    'repayment',
    {
      repaymentId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      interest: {
        type: DataTypes.FLOAT,
      },
      principle: {
        type: DataTypes.FLOAT,
      },
      status: {
        type: DataTypes.STRING,
      },
      paymentType: {
        type: DataTypes.STRING,
      },
      total: {
        type: DataTypes.FLOAT,
      },
      accountName: {
        type: DataTypes.STRING,
      },
      importedAt: {
        type: DataTypes.DATE,
      },
      dwollaTransferId: {
        type: DataTypes.STRING,
      },
      uploadId: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  RepaymentModel.associate = (models) => {
    models.InvestorModel.hasMany(RepaymentModel, {
      foreignKey: 'investorId',
      as: 'investorRepayment',
    });

    models.CampaignModel.hasMany(RepaymentModel, {
      foreignKey: 'campaignId',
      as: 'campaignRepayment',
    });
  };
  return RepaymentModel;
};
