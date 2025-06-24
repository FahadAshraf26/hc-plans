export default (sequelize, DataTypes) => {
  const HoneycombDwollaCustomerModel = sequelize.define(
    'honeycombDwollaCustomer',
    {
      honeycombDwollaCustomerId: {
        type: DataTypes.STRING,
      },
      dwollaCustomerId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      customerType: {
        type: DataTypes.STRING,
      },
      isController: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isAccountAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      dwollaBalanceId: {
        type: DataTypes.STRING,
      },
      dwollaDocumentId: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  HoneycombDwollaCustomerModel.associate = (models) => {
    HoneycombDwollaCustomerModel.belongsTo(models.UserModel, {
      foreignKey: 'userId',
    });

    HoneycombDwollaCustomerModel.belongsTo(models.IssuerModel, {
      foreignKey: 'issuerId',
    });

    HoneycombDwollaCustomerModel.hasOne(models.HoneycombDwollaBeneficialOwnerModel, {
      foreignKey: 'dwollaCustomerId',
    });
  };
  return HoneycombDwollaCustomerModel;
};
