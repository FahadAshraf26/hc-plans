export default (sequelize, DataTypes) => {
  const TosModel = sequelize.define(
    'tos',
    {
      tosId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      termOfServicesUpdateDate: {
        type: DataTypes.BOOLEAN,
      },
      privacyPolicyUpdateDate: {
        type: DataTypes.BOOLEAN,
      },
      educationalMaterialUpdateDate: {
        type: DataTypes.BOOLEAN,
      },
      faqsUpdateDate: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  return TosModel;
};
