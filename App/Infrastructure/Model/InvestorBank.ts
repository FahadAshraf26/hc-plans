import EncryptionService from '../Service/EncryptionService/EncryptionService';

export default (sequelize, DataTypes) => {
  const InvestorBankModel = sequelize.define(
    'investorBank',
    {
      investorBankId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      bankToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      accountType: {
        type: DataTypes.STRING,
        allowNull: true,
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
      wireRoutingNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bankName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dwollaFundingSourceId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  InvestorBankModel.associate = (models) => {
    InvestorBankModel.belongsTo(models.InvestorPaymentOptionModel, {
      foreignKey: 'investorPaymentOptionsId',
    });

    models.InvestorPaymentOptionModel.hasOne(InvestorBankModel, {
      foreignKey: 'investorPaymentOptionsId',
      as: 'bank',
    });
  };

  InvestorBankModel.prototype.encrypt = function () {
    try {
      if (this.routingNumber.trim().length > 0) {
        this.routingNumber = EncryptionService.encryptBankDetails(this.routingNumber);
      }
      if (this.accountNumber.trim().length > 0) {
        this.accountNumber = EncryptionService.encryptBankDetails(this.accountNumber);
      }
      if (this.wireRoutingNumber.trim().length > 0) {
        this.wireRoutingNumber = EncryptionService.encryptBankDetails(
          this.wireRoutingNumber,
        );
      }
    } catch (e) {}
  };

  InvestorBankModel.prototype.decrypt = function () {
    try {
      if (this.routingNumber.trim().length > 0) {
        this.routingNumber = EncryptionService.decryptBankDetails(this.routingNumber);
      }
      if (this.accountNumber.trim().length > 0) {
        this.accountNumber = EncryptionService.decryptBankDetails(this.accountNumber);
      }
      if (this.wireRoutingNumber.trim().length > 0) {
        this.wireRoutingNumber = EncryptionService.decryptBankDetails(
          this.wireRoutingNumber,
        );
      }
    } catch (e) {}
  };

  InvestorBankModel.beforeCreate((investorBank, options) => {
    investorBank.encrypt();
  });

  InvestorBankModel.beforeUpdate((investorBank, options) => {
    investorBank.encrypt();
  });

  InvestorBankModel.afterFind((result) => {
    if (result) {
      if (Array.isArray(result)) {
        for (const record of result) {
          record.routingNumber =
            record.routingNumber && record.routingNumber !== null
              ? EncryptionService.decryptBankDetails(record.routingNumber)
              : undefined;
          record.accountNumber =
            record.accountNumber && record.accountNumber !== null
              ? EncryptionService.decryptBankDetails(record.accountNumber)
              : undefined;
        }
      } else {
        result.routingNumber =
          result.routingNumber && result.routingNumber !== null
            ? EncryptionService.decryptBankDetails(result.routingNumber)
            : undefined;
        result.accountNumber =
          result.accountNumber && result.accountNumber !== null
            ? EncryptionService.decryptBankDetails(result.accountNumber)
            : undefined;
      }

      return result;
    }
  });

  return InvestorBankModel;
};
