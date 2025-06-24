import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class Campaign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of the Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Note: All `...Model` suffixes have been removed from the model names (e.g., models.IssuerModel -> models.Issuer)
      // and `CampaignModel` is replaced with `this` to refer to the current class.

      // Issuer
      models.Issuer.hasMany(this, { foreignKey: "issuerId", as: "campaigns" });
      this.belongsTo(models.Issuer, { foreignKey: "issuerId", as: "issuer" });

      // Campaign Tag (Many-to-Many)
      models.Tag.belongsToMany(this, {
        through: models.CampaignTag,
        as: "campaigns",
        foreignKey: "tagId",
      });
      this.belongsToMany(models.Tag, {
        through: models.CampaignTag,
        as: "tags",
        foreignKey: "campaignId",
      });
      models.CampaignTag.belongsTo(models.Tag, {
        as: "tag",
        foreignKey: "tagId",
      });
      models.CampaignTag.belongsTo(this, { foreignKey: "campaignId" });

      // Favorite Campaign (Many-to-Many)
      models.Investor.belongsToMany(this, {
        through: models.FavoriteCampaign,
        foreignKey: "investorId",
        as: "campaigns",
      });
      this.belongsToMany(models.Investor, {
        through: models.FavoriteCampaign,
        foreignKey: "campaignId",
        as: "interestedInvestors",
      });
      this.hasMany(models.FavoriteCampaign, { foreignKey: "campaignId" });
      models.FavoriteCampaign.belongsTo(models.Investor, {
        foreignKey: "investorId",
        as: "investor",
      });
      models.Investor.hasMany(models.FavoriteCampaign, {
        foreignKey: "investorId",
        as: "likedCampaigns",
      });

      // Campaign News
      this.hasMany(models.CampaignNews, {
        foreignKey: "campaignId",
        as: "campaignNews",
      });
      models.CampaignNews.belongsTo(this, {
        foreignKey: "campaignId",
        as: "campaigns",
      });

      // Campaign Offering Change
      // this.hasMany(models.CampaignOfferingChange, {
      //   foreignKey: "campaignId",
      //   as: "campaignOfferingChange",
      // });
      // models.CampaignOfferingChange.belongsTo(this, {
      //   foreignKey: "campaignId",
      //   as: "campaigns",
      // });

      // Campaign Documents
      this.hasMany(models.CampaignDocument, { foreignKey: "campaignId" });

      // Campaign Risk
      this.hasMany(models.CampaignRisk, { foreignKey: "campaignId" });
      models.CampaignRisk.belongsTo(this, { foreignKey: "campaignId" });

      // Campaign Notes
      // this.hasMany(models.CampaignNotes, { foreignKey: "campaignId" });

      // Campaign QA
      this.hasMany(models.CampaignQA, {
        onDelete: "CASCADE",
        foreignKey: "campaignId",
      });
      models.CampaignQA.belongsTo(this, { foreignKey: "campaignId" });
      models.User.hasMany(models.CampaignQA, {
        onDelete: "CASCADE",
        foreignKey: "userId",
        as: "userQuestions",
      });
      models.CampaignQA.belongsTo(models.User, {
        onDelete: "CASCADE",
        foreignKey: "userId",
        as: "user",
      });

      // Campaign Info
      this.hasOne(models.CampaignInfo, {
        foreignKey: "campaignId",
        as: "campaignInfo",
      });
      models.CampaignInfo.belongsTo(this, { foreignKey: "campaignId" });

      // Campaign RoughBudget
      this.hasMany(models.RoughBudget, { foreignKey: "campaignId" });
      models.RoughBudget.belongsTo(this, { foreignKey: "campaignId" });

      // Campaign PL
      this.hasMany(models.PL, { foreignKey: "campaignId" });
      models.PL.belongsTo(this, { foreignKey: "campaignId" });

      // Campaign News Media
      models.CampaignNews.hasMany(models.CampaignNewsMedia, {
        foreignKey: "campaignNewsId",
      });

      // Campaign Media
      this.hasMany(models.CampaignMedia, { foreignKey: "campaignId" });
      models.CampaignMedia.belongsTo(this, { foreignKey: "campaignId" });

      // Campaign Fund
      this.hasMany(models.CampaignFund, {
        foreignKey: "campaignId",
        as: "campaignFunds",
      });
      models.CampaignFund.belongsTo(this, {
        foreignKey: "campaignId",
        as: "campaign",
      });
      models.Investor.hasMany(models.CampaignFund, {
        foreignKey: "investorId",
        as: "investments",
      });
      models.CampaignFund.belongsTo(models.Investor, {
        foreignKey: "investorId",
        as: "campaignInvestor",
      });
      // Note: A redundant belongsTo was removed, the one with the 'as' alias is kept.
      this.hasOne(models.CampaignFund, { foreignKey: "campaignId" }); // This seems unusual alongside a hasMany. Review if needed.

      // Campaign Charge Fee
      this.hasMany(models.CampaignHoneycombChargeFee, {
        foreignKey: "campaignId",
        as: "campaignHoneycombChargeFee",
      });
      models.CampaignHoneycombChargeFee.belongsTo(this, {
        foreignKey: "campaignId",
      });

      // Repayments
      this.hasMany(models.Repayment, { foreignKey: "campaignId" });
      models.Repayment.belongsTo(this, { foreignKey: "campaignId" });

      // Investor Payments
      this.hasMany(models.InvestorPayments, { foreignKey: "campaignId" });
      models.InvestorPayments.belongsTo(this, { foreignKey: "campaignId" });

      // Campaign Principle Forgiven
      // this.hasOne(models.CampaignPrincipleForgiven, {
      //   foreignKey: "campaignId",
      //   as: "campaignPrincipleForgiven",
      // });

      // Campaign Notification
      this.hasMany(models.CampaignNotification, { foreignKey: "campaignId" });

      // Campaign Address
      this.hasOne(models.CampaignAddress, {
        foreignKey: "campaignId",
        as: "campaignAddress",
      });
    }
  }

  // Initialize the model with its attributes and options
  Campaign.init(
    {
      // --- Attributes Definition ---
      campaignId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      campaignName: { type: DataTypes.STRING, allowNull: false },
      campaignStartDate: { type: DataTypes.DATEONLY },
      campaignDuration: { type: DataTypes.INTEGER },
      campaignExpirationDate: { type: DataTypes.DATEONLY },
      campaignStage: { type: DataTypes.STRING },
      campaignTargetAmount: { type: DataTypes.FLOAT, allowNull: false },
      campaignMinimumAmount: { type: DataTypes.FLOAT, allowNull: false },
      investmentType: { type: DataTypes.STRING, allowNull: false },
      earningProcess: { type: DataTypes.TEXT, allowNull: true },
      overSubscriptionAccepted: { type: DataTypes.BOOLEAN },
      typeOfSecurityOffered: { type: DataTypes.TEXT },
      useOfProceeds: { type: DataTypes.TEXT },
      salesLead: { type: DataTypes.STRING },
      summary: { type: DataTypes.TEXT },
      demoLink: { type: DataTypes.TEXT },
      isLocked: { type: DataTypes.BOOLEAN },
      financialProjectionsDescription: { type: DataTypes.TEXT },
      howHoneycombIsCompensated: { type: DataTypes.TEXT },
      campaignDocumentUrl: { type: DataTypes.TEXT },
      ncOfferingId: { type: DataTypes.STRING },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      repaymentSchedule: { type: DataTypes.STRING },
      collateral: { type: DataTypes.STRING },
      annualInterestRate: { type: DataTypes.FLOAT },
      maturityDate: { type: DataTypes.DATE },
      repaymentStartDate: { type: DataTypes.DATE },
      loanDuration: { type: DataTypes.FLOAT },
      isChargeFee: { type: DataTypes.BOOLEAN, defaultValue: true },
      interestOnlyLoanDuration: { type: DataTypes.FLOAT },
      campaignEndTime: { type: DataTypes.STRING },
      campaignTimezone: { type: DataTypes.STRING },
      blanketLien: { type: DataTypes.BOOLEAN },
      equipmentLien: { type: DataTypes.BOOLEAN },
      isPersonalGuarantyFilled: { type: DataTypes.BOOLEAN },
      personalGuaranty: { type: DataTypes.STRING },
      shareValue: { type: DataTypes.FLOAT },
      escrowType: { type: DataTypes.STRING },
      isChargeStripe: { type: DataTypes.BOOLEAN, defaultValue: true },
      isCampaignAddress: { type: DataTypes.BOOLEAN, defaultValue: false },
      competitorOffering: { type: DataTypes.STRING, allowNull: true },
      isShowOnExplorePage: { type: DataTypes.BOOLEAN, defaultValue: true },
      investmentConfiguration: { type: DataTypes.JSON },
      dividendRate: { type: DataTypes.FLOAT },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "Campaign",
      tableName: "campaigns", // Explicitly set table name
      timestamps: true,
      paranoid: true,
    }
  );

  return Campaign;
};
