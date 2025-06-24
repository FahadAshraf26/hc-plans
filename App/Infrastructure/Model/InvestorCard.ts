import EncryptionService from '../Service/EncryptionService/EncryptionService';

export default (sequelize, DataTypes) => {
  const InvestorCardModel = sequelize.define(
    'investorCard',
    {
      investorCardId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      creditCardName: {
        type: DataTypes.STRING,
      },
      cardType: {
        type: DataTypes.STRING,
      },
      lastFour: {
        type: DataTypes.STRING,
      },
      isStripeCard: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  InvestorCardModel.associate = (models) => {
    InvestorCardModel.belongsTo(models.InvestorPaymentOptionModel, {
      foreignKey: 'investorPaymentOptionsId',
    });

    // models.InvestorPaymentOptionModel.hasOne(InvestorCardModel, {
    //     foreignKey: 'investorPaymentOptionsId',
    //     as: 'card',
    // });
  };

  InvestorCardModel.prototype.encrpyt = function () {
    try {
      if (this.creditCardNumber) {
        this.creditCardNumber = EncryptionService.encryptBankDetails(
          this.creditCardNumber,
        );
      }

      if (this.expirationDate) {
        this.expirationDate = EncryptionService.encryptBankDetails(this.expirationDate);
      }

      if (this.cvvNumber) {
        this.cvvNumber = EncryptionService.encryptBankDetails(this.cvvNumber);
      }
    } catch (err) {}
  };

  InvestorCardModel.prototype.decrypt = function () {
    try {
      if (!!this.creditCardNumber) {
        this.creditCardNumber = EncryptionService.decryptBankDetails(
          this.creditCardNumber,
        );
      }
      if (!!this.expirationDate) {
        this.expirationDate = EncryptionService.decryptBankDetails(this.expirationDate);
      }
      if (!!this.cvvNumber) {
        this.cvvNumber = EncryptionService.decryptBankDetails(this.cvvNumber);
      }
    } catch (e) {}
  };

  InvestorCardModel.beforeCreate((investorCard, options) => {
    investorCard.encrpyt();
  });

  InvestorCardModel.beforeUpdate((investorCard, options) => {
    investorCard.encrypt();
  });

  InvestorCardModel.afterFind((result) => {
    if (result) {
      if (Array.isArray(result)) {
        for (const record of result) {
          record.decrypt();
        }
      } else {
        result.decrypt();
      }

      return result;
    }
  });

  return InvestorCardModel;
};
