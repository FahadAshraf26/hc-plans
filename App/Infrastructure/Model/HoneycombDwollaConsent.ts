export default (sequelize, DataTypes) => {
  const HoneycombDwollaConsentModel = sequelize.define(
    'honeycombDwollaConsent',
    {
      honeycombDwollaConsentId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      consentDate: {
        type: DataTypes.DATE,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  HoneycombDwollaConsentModel.associate = (models) => {
    HoneycombDwollaConsentModel.belongsTo(models.UserModel, {
      foreignKey: 'userId',
    });

    HoneycombDwollaConsentModel.belongsTo(models.IssuerModel, {
      foreignKey: 'issuerId',
    });
  };
  return HoneycombDwollaConsentModel;
};
