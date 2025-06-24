import Campaign from '../../Campaign/Campaign';
import InactiveCampaignException from '@domain/Core/CampaignFunds/Exceptions/InactiveCampaignException';
import CampaignStatusService from '@domain/Services/Campaigns/CampaignStatusService';
import User from '../../User/User';
import InvestorBankNotFoundException from '@domain/Exceptions/Investors/InvestorBankNotFoundException';
import InvestmentType from '../InvestmentType';
import TransactionType from '../TransactionType';

class CampaignFundService {
  campaign: Campaign;
  user: User;
  private paymentOption: any;
  private pledge: any;
  private transactionType: any;
  /**
   *
   * @param {Campaign} campaign
   * @param {User} user
   * @param paymentOption
   * @param {Number} pledge
   * @param transactionType
   */
  constructor(campaign, user, paymentOption, pledge, transactionType) {
    this.campaign = campaign;
    this.user = user;
    this.paymentOption = paymentOption;
    this.pledge = pledge;
    this.transactionType = transactionType;
  }

  /**
   * returns list of goals that reached after this campaign
   * @param {number} campaignAccreditedRaised
   * @param {number} campaignNonAccreditedRaised
   * @returns {String[]}
   */
  haveAnyGoalsBeenReached(campaignAccreditedRaised, campaignNonAccreditedRaised) {
    const goals = {
      halfOfMinGoalReached: {
        target: Math.round(this.campaign.campaignMinimumAmount / 2),
        priority: 1,
      },
      minGoalReached: { target: this.campaign.campaignMinimumAmount, priority: 2 },
      maxGoalReached: { target: this.campaign.campaignTargetAmount, priority: 3 },
    };

    const statusService = CampaignStatusService.createFromDetails({
      campaign: this.campaign,
      sumAccredited: campaignAccreditedRaised,
      sumNonAccredited: campaignNonAccreditedRaised,
    });

    const calculateGoalsStatus = Object.keys(goals).map((key) => {
      return {
        [key]: statusService.isTargetAchieved(goals[key].target),
      };
    }); // [ { "minGoalReached" : true } ]

    // without new Investment
    const goalsNotAlreadyReached = calculateGoalsStatus.filter(
      (x) => !x[Object.keys(x)[0]],
    );

    // check if any goals reached after new investment
    let goalsPassedAfterInvestment: any = goalsNotAlreadyReached.filter((x) => {
      return statusService.isTargetAchieved(goals[Object.keys(x)[0]].target, this.pledge);
    });

    // only one goal should be returned
    if (goalsPassedAfterInvestment.length >= 1) {
      goalsPassedAfterInvestment = goalsPassedAfterInvestment.reduce(
        (res, x) => {
          goals;
          return goals[Object.keys(x)[0]].priority > res.priority
            ? { ...x, priority: goals[Object.keys(x)[0]].priority }
            : res;
        },
        { priority: 0 },
      );
    }

    return [Object.keys(goalsPassedAfterInvestment)[0]];
  }

  /**
   * returns the investment type
   * @param {Number} amountInvestedInLastTwelveMonths
   * @returns {String}
   */
  getInvestmentType(amountInvestedInLastTwelveMonths) {
    const isAmountGreaterThanInvestmentLimit =
      amountInvestedInLastTwelveMonths + this.pledge >
      this.user.investor.calculateInvestmentCap();

    const investmentType =
      isAmountGreaterThanInvestmentLimit && this.user.investor.getAccreditationStatus()
        ? InvestmentType.Accredited()
        : InvestmentType.NonAccredited();

    return investmentType;
  }

  validateUser(amountInvestedInLastTwelveMonths) {
    // @throws domain exception
    this.user.isEligibleToInvest();

    if (
      (this.transactionType === TransactionType.ACH().getValue() ||
        this.transactionType === TransactionType.Hybrid().getValue()) &&
      !this.paymentOption
    ) {
      throw new InvestorBankNotFoundException();
    }

    this.user.hasInvestmentLimitReached(this.pledge, amountInvestedInLastTwelveMonths);
  }

  validateCampaign({ campaignAccreditedRaised, campaignNonAccreditedRaised, campaign }) {
    if (!this.campaign.isActiveCampaign()) {
      throw new InactiveCampaignException();
    }

    const statusService = CampaignStatusService.createFromDetails({
      campaign: this.campaign,
      sumAccredited: campaignAccreditedRaised,
      sumNonAccredited: campaignNonAccreditedRaised,
    });
    if (campaign.getOverSubscriptionAccepted()) {
      return true;
    }
    return statusService.isAcceptingNewInvestments(this.pledge);
  }

  /**
   *
   * @param {{campaign:Campaign,user:User,paymentOption:InvestorPaymentOptions}} args
   */
  static create({ campaign, user, paymentOption, pledge, transactionType }) {
    return new CampaignFundService(
      campaign,
      user,
      paymentOption,
      pledge,
      transactionType,
    );
  }
}

export default CampaignFundService;
