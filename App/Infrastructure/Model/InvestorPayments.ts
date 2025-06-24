export default (sequelize, DataTypes) => {
  const InvestorPaymentsModel = sequelize.define(
    'investorPayments',
    {
      investorPaymentsId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      prorate: {
        type: DataTypes.FLOAT,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  return InvestorPaymentsModel;
};
