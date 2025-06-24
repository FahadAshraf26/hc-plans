import moment from 'moment';
import { CampaignStage } from '../Core/ValueObjects/CampaignStage';
import roundTo from '@infrastructure/Utils/roundTo';
import User from '@domain/Core/User/User';

type InvestorPortfolio = {
  investmentLimit: number | any;
  avgInvestment: number;
  invested: number;
  successfulInvestments: number;
  totalInvestorRepaid?: number;
  totalInvestedWithFee?: number;
  projectedReturns?: number;
  nextPaymentInDays?: any;
  principleLeft?: number;
  nextPaymentAmount?: any;
  lastUpdateDate?: any;
  totalDebtInvested?: any;
  totalEquityInvested?: any;
  principleForgivenAmount?: any;
  totalRevShareInvested?: number;
  totalCommitted?: number;
  totalConvertibleNoteInvested?: number;
  totalSafeInvested?: number;
  totalSafeDiscountInvested?: number;
  totalDebtAndRevInvestment?: number;
  totalEquityAndConvertibleAndSafeInvestment?: number;
};

class InvestorPortfolioService {
  private user: User;
  private investments: any;
  private campaignsInvestedIn: any;
  private portfolioData: any;
  private lastUpdate: any;
  private entityId: string;

  constructor(
    user?: User,
    investments?: any,
    campaignsInvestedIn?: any,
    portfolioData?: any,
    lastUpdate?: any,
  ) {
    this.user = user;
    this.investments = investments;
    this.campaignsInvestedIn = campaignsInvestedIn;
    this.portfolioData = portfolioData;
    this.lastUpdate = lastUpdate;
    this.entityId = null;
  }

  static createFromDetails(
    user,
    investments,
    campaignsInvestedIn?,
    portfolioData?,
    lastUpdate?,
  ) {
    return new InvestorPortfolioService(
      user,
      investments,
      campaignsInvestedIn,
      portfolioData,
      lastUpdate,
    );
  }

  setEntityId(entityId) {
    this.entityId = entityId;
  }

  getInvestmentLimit(date = null) {
    if (!this.user.investor) {
      return false;
    }

    const limit = this.user.investor.getAccreditationStatus()
      ? 'N/A'
      : this.user.investor.calculateInvestmentCap() - this.getInvestedAmount(date);

    return typeof limit === 'number' && limit < 0 ? 0 : limit;
  }

  getInvestedAmount(date = null) {
    const investments = date
      ? this.investments.filter((investment) => new Date(investment.createdAt) > date)
      : this.investments;

    return investments.reduce((sum, investment) => sum + investment.Amount(), 0);
  }

  getSuccessfullCampaignInvestment() {
    const successfulStages = [CampaignStage.FUNDED, CampaignStage.FUNDRAISING];
    const investments = this.investments.filter((investment) => {
      return successfulStages.includes(investment.Campaign().campaignStage);
    });

    return investments.reduce((sum, investment) => sum + investment.Amount(), 0);
  }

  /**
   * filter investments/campaigns whose maturity date has passed
   * assuming that means they have paid back the loan.
   */
  filterCompletedInvestments() {
    const FundedStages = [
      CampaignStage.FUNDED,
      CampaignStage.PENDING_PAYMENT,
      CampaignStage.PAID_OFF,
      CampaignStage.EARLY_COMPLETE,
      CampaignStage.PAYING_YOU,
    ];

    return this.investments.filter(({ campaign }) => {
      if (!campaign.repaymentStartDate || !campaign.loanDuration) {
        return false;
      }

      const isMaturityLeft = moment
        .utc(campaign.repaymentStartDate)
        .add(campaign.loanDuration, 'y')
        .isAfter(moment.utc());
      const isFunded =
        FundedStages.includes(campaign.campaignStage) &&
        campaign.campaignStage !== CampaignStage.PAID_OFF;

      return isMaturityLeft && isFunded;
    });
  }

  filterPastInvestments() {
    return this.investments.filter((investment) => {
      const campaignStage = investment.campaign.campaignStage;
      return (
        campaignStage !== CampaignStage.NOT_FUNDED &&
        campaignStage !== CampaignStage.DEFAULT &&
        campaignStage !== CampaignStage.PAID_OFF
      );
    });
  }

  getPotentialReturns() {
    const investments = this.investments.filter((investment) => {
      const campaignStage = investment.campaign.campaignStage;
      return (
        campaignStage !== CampaignStage.NOT_FUNDED &&
        campaignStage !== CampaignStage.PAID_OFF
      );
    });

    const { potentialReturnSum, sumInvestments } =
      investments.length > 0
        ? investments.reduce(
            ({ potentialReturnSum, sumInvestments }, investment) => {
              const { annualInterestRate, loanDuration } = investment.campaign;
              const totalInterest = roundTo(annualInterestRate * loanDuration, 2, true);

              const potentialReturn = (totalInterest / 100) * investment.amount;

              return {
                potentialReturnSum: potentialReturnSum + potentialReturn,
                sumInvestments: sumInvestments + investment.amount,
              };
            },
            {
              potentialReturnSum: 0,
              sumInvestments: 0,
            },
          )
        : {
            potentialReturnSum: 0,
            sumInvestments: 0,
          };

    const potentialReturnPercentage =
      sumInvestments > 0 ? roundTo(potentialReturnSum / sumInvestments, 4, true) : 0;

    const potentialReturns = sumInvestments * potentialReturnPercentage;

    return {
      calculatedPotentialReturns: roundTo(potentialReturnSum, 2, true),
      potentialReturns,
      potentialReturnPercentage: potentialReturnPercentage * 100,
    };
  }

  getAvgInvestment(date?) {
    return roundTo(
      this.getInvestedAmount(date) /
        (!!this.investments.length ? this.investments.length : 1),
      2,
      true,
    );
  }

  getInvestorPortfolio(): InvestorPortfolio {
    const dateToFilterBy = new Date();
    dateToFilterBy.setMonth(dateToFilterBy.getMonth() - 12);

    const totalPrincipleRepaid =
      this.portfolioData.totalPrinciple > 0
        ? roundTo(this.portfolioData.totalPrinciple, 2)
        : 0;
    const totalProjectedReturns = this.portfolioData.projectionReturns;
    const totalDebtAndRevInvestment =
      this.portfolioData.totalDebtInvested + this.portfolioData.totalRevShareInvested;
    const principleTotal =
      totalDebtAndRevInvestment > 0 ? roundTo(totalDebtAndRevInvestment, 2) : 0;

    return {
      investmentLimit: !this.entityId
        ? this.getInvestmentLimit(dateToFilterBy)
        : 'unlimited',
      avgInvestment: this.getAvgInvestment(),
      invested: roundTo(this.portfolioData.totalInvestedWithoutFee, 2),
      successfulInvestments: this.getSuccessfullCampaignInvestment(),
      totalInvestedWithFee:
        this.portfolioData.totalInvested > 0
          ? roundTo(this.portfolioData.totalInvested, 2)
          : 0,
      totalInvestorRepaid:
        this.portfolioData.totalRepaid > 0
          ? roundTo(this.portfolioData.totalRepaid, 2)
          : 0,
      projectedReturns: totalProjectedReturns > 0 ? roundTo(totalProjectedReturns, 2) : 0,
      nextPaymentInDays: this.portfolioData.nextPaymentDate,
      nextPaymentAmount:
        this.portfolioData.nextPaymentAmount > 0
          ? roundTo(this.portfolioData.nextPaymentAmount, 2)
          : 0,
      principleLeft:
        principleTotal -
        totalPrincipleRepaid -
        this.portfolioData.principleForgivenAmount,
      lastUpdateDate: this.lastUpdate,
      totalDebtInvested: this.portfolioData.totalDebtInvested,
      totalEquityInvested: this.portfolioData.totalEquityInvested,
      principleForgivenAmount: this.portfolioData.principleForgivenAmount,
      totalRevShareInvested: this.portfolioData.totalRevShareInvested,
      totalCommitted: this.getInvestedAmount(),
      totalConvertibleNoteInvested: this.portfolioData.totalConvertibleNoteInvested,
      totalSafeInvested: this.portfolioData.totalSafeInvested,
      totalSafeDiscountInvested: this.portfolioData.totalSafeDiscountInvested,
      totalDebtAndRevInvestment,
      totalEquityAndConvertibleAndSafeInvestment:
        this.portfolioData.totalEquityInvested +
        this.portfolioData.totalConvertibleNoteInvested +
        this.portfolioData.totalSafeInvested +
        this.portfolioData.totalSafeDiscountInvested,
    };
  }
}

export default InvestorPortfolioService;
