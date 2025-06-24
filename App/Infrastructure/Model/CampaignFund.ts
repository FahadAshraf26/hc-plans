export default (sequelize, DataTypes) => {
  const CampaignFundModel = sequelize.define(
    'campaignFund',
    {
      campaignFundId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      investorAccreditationStatus: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      investorNetWorth: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      investorAnnualIncome: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      investmentType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ip: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      entityId: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      promotionCredits: {
        type: DataTypes.FLOAT,
      },
      netAmount: {
        type: DataTypes.FLOAT,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  CampaignFundModel.associate = (models) => {
    CampaignFundModel.belongsTo(models.ChargeModel, {
      foreignKey: 'chargeId',
      as: 'charge',
    });
    models.ChargeModel.hasOne(CampaignFundModel, {
      foreignKey: 'chargeId',
      as: 'investmentCharge',
    });
    models.InvestorModel.hasOne(CampaignFundModel, {
      foreignKey: 'investorId',
      as: 'investor',
    });
    models.CampaignModel.hasOne(CampaignFundModel, {
      foreignKey: 'campaignId',
      as: 'campaign',
    });

    CampaignFundModel.hasMany(models.HybridTransactionModel, {
      foreignKey: 'campaignFundId',
      as: 'campaignHybridTransactions',
    });

    // CampaignFundModel.belongsTo(models.InvestorPaymentOptionModel, {
    //   foreignKey: "investorPaymentOptionsId",
    //   as: "paymentOption"
    // })

    // models.CampaignFundIntermediatoryChargeModel.belongsTo(CampaignFundModel, {
    //   foreignKey: 'campaignFundId',
    //   as: 'intermediatoryCharge',
    // });

    // CampaignFundModel.hasOne(models.CampaignFundIntermediatoryChargeModel, {
    //   foreignKey: 'campaignFundId',
    //   as: 'intermediatoryCharge',
    // });

    // CampaignFundModel.hasMany(models.CampaignFundFinalChargeModel, {
    //   foreignKey: 'campaignFundId',
    //   as: 'finalCharges',
    // });
    // models.EntityCampaignFundModel.hasOne(models.CampaignFundModel, {
    //     foreignKey: 'campaignFundId',
    //     as: 'entityCampaignFund',
    // });
  };

  return CampaignFundModel;
};
