export default (sequelize, DataTypes) => {
  const InvestorPaymentOptionsModel = sequelize.define(
    'investorPaymentOption',
    {
      investorPaymentOptionsId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  InvestorPaymentOptionsModel.associate = (models) => {
    models.InvestorPaymentOptionModel.hasOne(models.InvestorCardModel, {
      foreignKey: 'investorPaymentOptionsId',
      as: 'card',
    });

    InvestorPaymentOptionsModel.belongsTo(models.InvestorModel, {
      foreignKey: 'investorId',
    });

    models.InvestorModel.hasMany(InvestorPaymentOptionsModel, {
      foreignKey: 'investorId',
      as: 'investorBank',
    });
  };

  return InvestorPaymentOptionsModel;
};
