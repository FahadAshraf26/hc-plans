export default (sequelize, DataTypes) => {
  const CampaignModel = sequelize.define(
    'campaign',
    {
      campaignId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      campaignName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      campaignStartDate: {
        type: DataTypes.DATEONLY,
      },
      campaignDuration: {
        type: DataTypes.INTEGER,
      },
      campaignExpirationDate: {
        type: DataTypes.DATEONLY,
      },
      campaignStage: {
        type: DataTypes.STRING,
      },
      campaignTargetAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      campaignMinimumAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      investmentType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      earningProcess: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      overSubscriptionAccepted: {
        type: DataTypes.BOOLEAN,
      },
      typeOfSecurityOffered: {
        type: DataTypes.TEXT,
      },
      useOfProceeds: {
        type: DataTypes.TEXT,
      },
      salesLead: {
        type: DataTypes.STRING,
      },
      summary: {
        type: DataTypes.TEXT,
      },
      demoLink: {
        type: DataTypes.TEXT,
      },
      isLocked: {
        type: DataTypes.BOOLEAN,
      },
      financialProjectionsDescription: {
        type: DataTypes.TEXT,
      },
      howHoneycombIsCompensated: {
        type: DataTypes.TEXT,
      },
      campaignDocumentUrl: {
        type: DataTypes.TEXT,
      },
      ncOfferingId: {
        type: DataTypes.STRING,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      repaymentSchedule: {
        type: DataTypes.STRING,
      },
      collateral: {
        type: DataTypes.STRING,
      },
      annualInterestRate: {
        type: DataTypes.FLOAT,
      },
      maturityDate: {
        type: DataTypes.DATE,
      },
      repaymentStartDate: {
        type: DataTypes.DATE,
      },
      loanDuration: {
        type: DataTypes.FLOAT,
      },
      isChargeFee: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      interestOnlyLoanDuration: {
        type: DataTypes.FLOAT,
      },
      campaignEndTime: {
        type: DataTypes.STRING,
      },
      campaignTimezone: {
        type: DataTypes.STRING,
      },
      blanketLien: {
        type: DataTypes.BOOLEAN,
      },
      equipmentLien: {
        type: DataTypes.BOOLEAN,
      },
      isPersonalGuarantyFilled: {
        type: DataTypes.BOOLEAN,
      },
      personalGuaranty: {
        type: DataTypes.STRING,
      },
      shareValue: {
        type: DataTypes.FLOAT,
      },
      escrowType: {
        type: DataTypes.STRING,
      },
      isChargeStripe: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      isCampaignAddress: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      competitorOffering: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isShowOnExplorePage: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      investmentConfiguration: {
        type: DataTypes.JSON,
      },
      dividendRate: {
        type: DataTypes.FLOAT,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  CampaignModel.associate = (models) => {
    // Issuer
    models.IssuerModel.hasMany(CampaignModel, {
      foreignKey: 'issuerId',
      as: 'campaigns',
    });
    CampaignModel.belongsTo(models.IssuerModel, { foreignKey: 'issuerId', as: 'issuer' });
    // campaign Tag

    models.TagModel.belongsToMany(CampaignModel, {
      through: models.CampaignTagModel,
      as: 'campaigns',
      foreignKey: 'tagId',
    });

    CampaignModel.belongsToMany(models.TagModel, {
      through: models.CampaignTagModel,
      as: 'tags',
      foreignKey: 'campaignId',
    });

    models.CampaignTagModel.belongsTo(models.TagModel, {
      as: 'tag',
      foreignKey: 'tagId',
    });

    models.CampaignTagModel.belongsTo(CampaignModel, {
      foreignKey: 'campaignId',
    });

    // favorite campaign

    models.InvestorModel.belongsToMany(CampaignModel, {
      through: models.FavoriteCampaignModel,
      foreignKey: 'investorId',
      as: 'campaigns',
    });

    CampaignModel.belongsToMany(models.InvestorModel, {
      through: models.FavoriteCampaignModel,
      foreignKey: 'campaignId',
      as: 'interestedInvestors',
    });

    CampaignModel.hasMany(models.FavoriteCampaignModel, {
      foreignKey: 'campaignId',
    });

    models.FavoriteCampaignModel.belongsTo(models.InvestorModel, {
      foreignKey: 'investorId',
      as: 'investor',
    });

    models.InvestorModel.hasMany(models.FavoriteCampaignModel, {
      foreignKey: 'investorId',
      as: 'likedCampaigns',
    });

    // Campaign News
    CampaignModel.hasMany(models.CampaignNewsModel, {
      foreignKey: 'campaignId',
      as: 'campaignNews',
    });

    models.CampaignNewsModel.belongsTo(CampaignModel, {
      foreignKey: 'campaignId',
      as: 'campaigns',
    });

    // Campaign offering change
    CampaignModel.hasMany(models.CampaignOfferingChangeModel, {
      foreignKey: 'campaignId',
      as: 'campaignOfferingChange',
    });

    models.CampaignOfferingChangeModel.belongsTo(CampaignModel, {
      foreignKey: 'campaignId',
      as: 'campaigns',
    });

    // campaign Documents
    CampaignModel.hasMany(models.CampaignDocumentModel, {
      foreignKey: 'campaignId',
    });
    // campaign Risk
    CampaignModel.hasMany(models.CampaignRiskModel, {
      foreignKey: 'campaignId',
    });

    models.CampaignRiskModel.belongsTo(CampaignModel, {
      foreignKey: 'campaignId',
    });
    // campaign Notes
    CampaignModel.hasMany(models.CampaignNotesModel, {
      foreignKey: 'campaignId',
    });
    // campaign QA

    CampaignModel.hasMany(models.CampaignQAModel, {
      onDelete: 'CASCADE',
      foreignKey: 'campaignId',
    });

    models.CampaignQAModel.belongsTo(CampaignModel, {
      foreignKey: 'campaignId',
    });

    models.UserModel.hasMany(models.CampaignQAModel, {
      onDelete: 'CASCADE',
      foreignKey: 'userId',
      as: 'userQuestions',
    });
    models.CampaignQAModel.belongsTo(models.UserModel, {
      onDelete: 'CASCADE',
      foreignKey: 'userId',
      as: 'user',
    });

    // Campaign Info
    CampaignModel.hasOne(models.CampaignInfoModel, {
      foreignKey: 'campaignId',
      as: 'campaignInfo',
    });

    models.CampaignInfoModel.belongsTo(CampaignModel, {
      foreignKey: 'campaignId',
    });

    //Campaign RoughBudget
    CampaignModel.hasMany(models.RoughBudgetModel, {
      foreignKey: 'campaignId',
    });
    models.RoughBudgetModel.belongsTo(CampaignModel, {
      foreignKey: 'campaignId',
    });

    //Camapign PL
    CampaignModel.hasMany(models.PLModel, { foreignKey: 'campaignId' });
    models.PLModel.belongsTo(CampaignModel, {
      foreignKey: 'campaignId',
    });

    models.CampaignNewsModel.hasMany(models.CampaignNewsMediaModel, {
      foreignKey: 'campaignNewsId',
    });

    CampaignModel.hasMany(models.CampaignMediaModel, {
      foreignKey: 'campaignId',
    });

    models.CampaignMediaModel.belongsTo(CampaignModel, {
      foreignKey: 'campaignId',
    });

    CampaignModel.hasMany(models.CampaignFundModel, {
      foreignKey: 'campaignId',
      as: 'campaignFunds',
    });

    models.CampaignFundModel.belongsTo(CampaignModel, {
      foreignKey: 'campaignId',
      as: 'campaign',
    });

    models.InvestorModel.hasMany(models.CampaignFundModel, {
      foreignKey: 'investorId',
      as: 'investments',
    });

    models.CampaignFundModel.belongsTo(models.InvestorModel, {
      foreignKey: 'investorId',
      as: 'campaignInvestor',
    });

    models.CampaignFundModel.belongsTo(CampaignModel, {
      foreignKey: 'campaignId',
    });

    CampaignModel.hasOne(models.CampaignFundModel, {
      foreignKey: 'campaignId',
    });

    //campaign charge fee
    CampaignModel.hasMany(models.CampaignHoneycombChargeFeeModel, {
      foreignKey: 'campaignId',
      as: 'campaignHoneycombChargeFee',
    });

    models.CampaignHoneycombChargeFeeModel.belongsTo(CampaignModel, {
      foreignKey: 'campaignId',
    });

    // repayments
    models.RepaymentModel.belongsTo(CampaignModel, {
      foreignKey: 'campaignId',
    });

    CampaignModel.hasMany(models.RepaymentModel, {
      foreignKey: 'campaignId',
    });

    // investorPayments

    models.InvestorPaymentsModel.belongsTo(CampaignModel, {
      foreignKey: 'campaignId',
    });

    CampaignModel.hasMany(models.InvestorPaymentsModel, {
      foreignKey: 'campaignId',
    });

    CampaignModel.hasOne(models.CampaignPrincipleForgivenModel, {
      foreignKey: 'campaignId',
      as: 'campaignPrincipleForgiven',
    });

    //campaignNotification
    CampaignModel.hasMany(models.CampaignNotificationModel, {
      foreignKey: 'campaignId',
    });

    //Campaign Address
    CampaignModel.hasOne(models.CampaignAddressModel, {
      foreignKey: 'campaignId',
      as: 'campaignAddress',
    });
  };

  return CampaignModel;
};
