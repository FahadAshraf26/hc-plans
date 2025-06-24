import EncryptionService from '../Service/EncryptionService/EncryptionService';

export default (sequelize, DataTypes) => {
  const IssuerBankModel = sequelize.define(
    'issuerBank',
    {
      issuerBankId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      accountType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dwollaSourceId: {
        type: DataTypes.STRING,
      },
      accountName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastFour: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      accountNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      routingNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isForRepayment: {
        type: DataTypes.BOOLEAN,
      },
      accountOwner: {
        type: DataTypes.STRING,
      },
      bankToken: {
        type: DataTypes.STRING,
      },
      wireRoutingNumber: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  IssuerBankModel.associate = (models) => {
    IssuerBankModel.belongsTo(models.IssuerModel, {
      foreignKey: 'issuerId',
    });

    models.IssuerModel.hasOne(IssuerBankModel, {
      foreignKey: 'issuerId',
      as: 'issuerBank',
    });
    IssuerBankModel.hasOne(models.DwollaFundingSourceVerificationModel, {
      foreignKey: 'dwollaSourceId',
    });
  };

  IssuerBankModel.beforeCreate((issuerBank, options) => {
    if (issuerBank.routingNumber) {
      issuerBank.routingNumber = EncryptionService.encryptBankDetails(
        issuerBank.routingNumber,
      );
    }

    if (issuerBank.accountNumber) {
      issuerBank.accountNumber = EncryptionService.encryptBankDetails(
        issuerBank.accountNumber,
      );
    }

    if (issuerBank.wireRoutingNumber) {
      issuerBank.wireRoutingNumber = EncryptionService.encryptBankDetails(
        issuerBank.wireRoutingNumber,
      );
    }
  });

  IssuerBankModel.beforeUpdate((issuerBank, options) => {
    if (issuerBank.routingNumber) {
      issuerBank.routingNumber = EncryptionService.encryptBankDetails(
        issuerBank.routingNumber,
      );
    }

    if (issuerBank.accountNumber) {
      issuerBank.accountNumber = EncryptionService.encryptBankDetails(
        issuerBank.accountNumber,
      );
    }

    if (issuerBank.wireRoutingNumber) {
      issuerBank.wireRoutingNumber = EncryptionService.encryptBankDetails(
        issuerBank.wireRoutingNumber,
      );
    }
  });

  IssuerBankModel.afterFind((result) => {
    if (result) {
      if (Array.isArray(result)) {
        for (const record of result) {
          if (record.routingNumber) {
            record.routingNumber = EncryptionService.decryptBankDetails(
              record.routingNumber,
            );
          }
          if (record.accountNumber) {
            record.accountNumber = EncryptionService.decryptBankDetails(
              record.accountNumber,
            );
          }
          if (record.wireRoutingNumber) {
            record.wireRoutingNumber = EncryptionService.decryptBankDetails(
              record.wireRoutingNumber,
            );
        }
      }
      } else {
        if (result.routingNumber) {
          result.routingNumber = EncryptionService.decryptBankDetails(
            result.routingNumber,
          );
        }
        if (result.accountNumber) {
          result.accountNumber = EncryptionService.decryptBankDetails(
            result.accountNumber,
          );
        } 
        if (result.wireRoutingNumber) {
          result.wireRoutingNumber = EncryptionService.decryptBankDetails(
            result.wireRoutingNumber,
          );
        }
      }
    }

    return result;
  });

  return IssuerBankModel;
};
