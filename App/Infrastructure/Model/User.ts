import EncryptionService from '@infrastructure/Service/EncryptionService/EncryptionService';

export default (sequelize, DataTypes) => {
  const UserModel = sequelize.define(
    'user',
    {
      userId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      userName: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      apartment: {
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
      dob: {
        type: DataTypes.DATEONLY,
      },
      phoneNumber: {
        type: DataTypes.STRING,
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
      website: {
        type: DataTypes.STRING,
      },
      ssn: {
        type: DataTypes.STRING,
      },
      prefix: {
        type: DataTypes.STRING,
      },
      isVerified: {
        type: DataTypes.STRING,
      },
      detailSubmittedDate: {
        type: DataTypes.DATE,
      },
      notificationToken: {
        type: DataTypes.STRING,
      },
      isEmailVerified: {
        type: DataTypes.STRING,
      },
      idVerifiedPrompt: {
        type: DataTypes.BOOLEAN,
      },
      portfolioVisited: {
        type: DataTypes.BOOLEAN,
      },
      ncPartyId: {
        type: DataTypes.STRING,
      },
      optOutOfEmail: {
        type: DataTypes.DATE,
      },
      moneyMadeId: {
        type: DataTypes.STRING,
      },
      shouldVerifySsn: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isSsnVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      country: {
        type: DataTypes.STRING,
      },
      isIntermediary: {
        type: DataTypes.BOOLEAN,
      },
      tos: {
        type: DataTypes.BOOLEAN,
      },
      optIn: {
        type: DataTypes.BOOLEAN,
      },
      businessOwner: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      lastPrompt: {
        type: DataTypes.BOOLEAN || DataTypes.DATE,
      },
      vcCustomerId: {
        type: DataTypes.STRING,
      },
      stripeCustomerId: {
        type: DataTypes.STRING,
      },
      idologyIdNumber: {
        type: DataTypes.STRING,
      },
      stripePaymentMethodId: {
        type: DataTypes.STRING,
      },
      signUpType: {
        type: DataTypes.STRING,
      },
      fcmToken: {
        type: DataTypes.STRING,
      },
      isBiometricEnabled: {
        type: DataTypes.BOOLEAN,
      },
      biometricKey: {
        type: DataTypes.STRING,
      },
      vcThreadBankCustomerId: {
        type: DataTypes.STRING,
      },
      isRaisegreen: {
        type: DataTypes.BOOLEAN,
      },
      kycProvider: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  UserModel.beforeCreate((user, options) => {
    user.ssn = user.ssn ? EncryptionService.encryptSsn(user.ssn) : undefined;
  });

  UserModel.beforeUpdate((user, options) => {
    user.ssn = user.ssn ? EncryptionService.encryptSsn(user.ssn) : undefined;
  });

  UserModel.afterFind((result) => {
    if (result) {
      if (Array.isArray(result)) {
        for (const record of result) {
          record.ssn =
            record.ssn && record.ssn !== 'null'
              ? EncryptionService.decryptSsn(record.ssn)
              : undefined;
        }
      } else {
        result.ssn =
          result.ssn && result.ssn !== 'null'
            ? EncryptionService.decryptSsn(result.ssn)
            : undefined;
      }

      if (result.investor && result.investor.investorBank) {
        if (Array.isArray(result.investor.investorBank)) {
          result.investor.investorBank.forEach((po) => {
            if (po.bank) {
              po.bank.decrypt();
            }

            if (po.card) {
              po.card.decrypt();
            }
          });
        }
      }
    }

    return result;
  });

  UserModel.beforeFind((data) => {
    if (data.where && data.where.ssn) {
      data.where.ssn = EncryptionService.encryptSsn(data.where.ssn);
    }
  });

  UserModel.associate = (models) => {
    UserModel.hasOne(models.ProfilePicModel, { foreignKey: 'userId', as: 'profilePic' });
    models.ProfilePicModel.belongsTo(UserModel, {
      foreignKey: 'userId',
    });

    UserModel.hasOne(models.OwnerModel, {
      onDelete: 'cascade',
      foreignKey: 'userId',
      as: 'owner',
    });
    models.OwnerModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' });

    UserModel.hasOne(models.InvestorModel, { onDelete: 'cascade', foreignKey: 'userId' });
    models.InvestorModel.belongsTo(UserModel, {
      foreignKey: 'userId',
    });

    UserModel.hasMany(models.InvitationModel, {
      foreignKey: 'initiator',
      as: 'invitor',
    });

    // user Documents
    UserModel.hasMany(models.UserDocumentModel, {
      foreignKey: 'userId',
    });
    models.UserDocumentModel.belongsTo(UserModel, {
      foreignKey: 'userId',
    });

    UserModel.hasMany(models.CapitalRequestModel, { foreignKey: 'userId', as: 'user' });

    UserModel.hasMany(models.UserMediaModel, { foreignKey: 'userId', as: 'userMedia' });
    models.UserMediaModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' });
    models.InvestorModel.belongsTo(UserModel, {
      foreignKey: 'userId',
    });
    UserModel.hasOne(models.InvestorModel, {
      foreignKey: 'userId',
    });

    // EntityIntermediary
    UserModel.hasMany(models.EntityIntermediaryModel, {
      foreignKey: 'userId',
    });

    UserModel.hasMany(models.HoneycombDwollaConsentModel, {
      foreignKey: 'userId',
    });

    UserModel.hasMany(models.HoneycombDwollaCustomerModel, {
      foreignKey: 'userId',
    });

    UserModel.hasMany(models.UserTagPreferenceModel, {
      foreignKey: 'userId',
      as: 'tagPreferences',
    });
  };

  return UserModel;
};
