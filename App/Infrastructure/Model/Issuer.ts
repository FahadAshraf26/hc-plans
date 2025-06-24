export default (sequelize, DataTypes) => {
  const IssuerModel = sequelize.define(
    'issuer',
    {
      issuerId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      issuerName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      physicalAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      website: {
        type: DataTypes.STRING,
      },
      businessType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      legalEntityType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      facebook: {
        type: DataTypes.STRING,
      },
      linkedIn: {
        type: DataTypes.STRING,
      },
      twitter: {
        type: DataTypes.STRING,
      },
      instagram: {
        type: DataTypes.STRING,
      },
      pinterest: {
        type: DataTypes.STRING,
      },
      reddit: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      EIN: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
      },
      state: {
        type: DataTypes.STRING,
      },
      zipCode: {
        type: DataTypes.STRING,
      },
      phoneNumber: {
        type: DataTypes.STRING,
      },
      latitude: {
        type: DataTypes.STRING,
      },
      longitude: {
        type: DataTypes.STRING,
      },
      previousName: {
        type: DataTypes.STRING,
      },
      ncIssuerId: {
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  IssuerModel.associate = (models) => {
    models.NaicModel.hasMany(IssuerModel, { foreignKey: 'naicId', as: 'issuers' });
    IssuerModel.belongsTo(models.NaicModel, { foreignKey: 'naicId', as: 'naic' });

    models.OwnerModel.belongsToMany(IssuerModel, {
      through: models.IssuerOwnerModel,
      as: 'issuers',
      foreignKey: 'ownerId',
    });
    IssuerModel.belongsToMany(models.OwnerModel, {
      through: models.IssuerOwnerModel,
      as: 'owners',
      foreignKey: 'issuerId',
    });

    models.IssuerBankModel.belongsTo(IssuerModel, {
      foreignKey: 'issuerId',
    });
    IssuerModel.hasMany(models.IssuerBankModel, {
      foreignKey: 'issuerId',
    });

    // issuer Documents
    IssuerModel.hasMany(models.IssuerDocumentModel, {
      foreignKey: 'issuerId',
    });
    models.IssuerDocumentModel.belongsTo(IssuerModel, {
      foreignKey: 'issuerId',
    });

    // Entity Intermediary
    IssuerModel.hasMany(models.EntityIntermediaryModel, {
      foreignKey: 'issuerId',
    });

    IssuerModel.hasMany(models.HoneycombDwollaConsentModel, {
      foreignKey: 'issuerId',
    });

    IssuerModel.hasMany(models.HoneycombDwollaCustomerModel, {
      foreignKey: 'issuerId',
    });

    IssuerModel.hasMany(models.DwollaPostTransactionsModel, {
      foreignKey: 'issuerId',
    });

    IssuerModel.hasMany(models.EmployeeLogModel, {
      foreignKey: 'issuerId',
      as: 'employeeLog',
    });

    IssuerModel.hasMany(models.DwollaCustodyTransferHistoryModel, {
      foreignKey: 'issuerId',
      constraints: false,
    });

    // Entity Campaign Fund
    // models.EntityCampaignFundModel.hasMany(IssuerModel, {
    //   as: 'entity',
    //   foreignKey: 'issuerId',
    // });
  };

  return IssuerModel;
};
