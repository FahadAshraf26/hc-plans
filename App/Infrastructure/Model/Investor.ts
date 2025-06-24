export default (sequelize, DataTypes) => {
  const InvestorModel = sequelize.define(
    'investor',
    {
      investorId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      annualIncome: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      netWorth: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      incomeVerificationTriggered: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      investingAvailable: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isAccredited: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      investmentCap: {
        type: DataTypes.INTEGER,
      },
      userProvidedCurrentInvestments: {
        type: DataTypes.BIGINT,
      },
      userProvidedCurrentInvestmentsDate: {
        type: DataTypes.DATE,
      },
      investReadyToken: {
        type: DataTypes.STRING,
      },
      investReadyRefreshToken: {
        type: DataTypes.STRING,
      },
      investReadyUserHash: {
        type: DataTypes.STRING,
      },
      accreditationExpiryDate: {
        type: DataTypes.DATE,
      },
      dwollaCustomerId: {
        type: DataTypes.STRING,
      },
      accreditedInvestorSubmission: {
        type: DataTypes.STRING,
      },
      accreditedInvestorSubmissionDate: {
        type: DataTypes.DATEONLY,
      },
      dwollaVerificationStatus: {
        type: DataTypes.STRING,
      },
      ncAccountId: {
        type: DataTypes.STRING,
      },
      incomeNetWorthSignedOn: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      vcCustomerKey: {
        type: DataTypes.STRING,
      },
      vcThreadBankCustomerKey: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  InvestorModel.associate = (models) => {
    // models.InvestorBankModel.belongsTo(InvestorModel, {
    //   foreignKey: 'investorId',
    // });

    // InvestorModel.hasMany(models.InvestorBankModel, {
    //   foreignKey: 'investorId',
    // });

    models.CampaignFundModel.belongsTo(InvestorModel, {
      foreignKey: 'investorId',
    });

    InvestorModel.hasMany(models.CampaignFundModel, {
      foreignKey: 'investorId',
    });

    models.UserModel.hasOne(InvestorModel, {
      foreignKey: 'userId',
      as: 'userSender',
    });

    models.RepaymentModel.belongsTo(InvestorModel, {
      foreignKey: 'investorId',
    });

    InvestorModel.hasMany(models.RepaymentModel, {
      foreignKey: 'investorId',
    });

    // investorPayments

    models.InvestorPaymentsModel.belongsTo(InvestorModel, {
      foreignKey: 'investorId',
    });

    InvestorModel.hasMany(models.InvestorPaymentsModel, {
      foreignKey: 'investorId',
    });

    //campaginNotification
    InvestorModel.hasMany(models.CampaignNotificationModel, {
      foreignKey: 'investorId',
    });

    
    InvestorModel.hasMany(models.FavoriteCampaignModel, {
      foreignKey: 'investorId',
    });
  };

  return InvestorModel;
};
