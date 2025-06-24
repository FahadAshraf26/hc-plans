export default (sequelize, DataTypes) => {
  const HoneycombDwollaBeneficialOwnerModel = sequelize.define(
    'honeycombDwollaBeneficialOwner',
    {
      honeycombDwollaBeneficialOwnerId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      dwollaBeneficialOwnerId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  HoneycombDwollaBeneficialOwnerModel.associate = (models) => {
    HoneycombDwollaBeneficialOwnerModel.belongsTo(models.OwnerModel, {
      foreignKey: 'ownerId',
      as: 'owner'
    });
    HoneycombDwollaBeneficialOwnerModel.belongsTo(models.HoneycombDwollaCustomerModel, {
      foreignKey: 'dwollaCustomerId',
    });
  };
  return HoneycombDwollaBeneficialOwnerModel;
};
