import Campaign from '@domain/Core/Campaign/Campaign';
import CampaignMaximumGoalReachedException from '@domain/Core/CampaignFunds/Exceptions/CampaignMaximumGoalReachedException';
import InvestmentAmountExceedsCampaignMaximum from '@domain/Core/CampaignFunds/Exceptions/InvestmentAmountExceedsCampaignMaximum';

type campaignStatusOptions = {
  campaign?: Campaign;
  sumAccredited?: number;
  sumNonAccredited?: number;
  campaignFunds?: any;
};

class CampaignStatusService {
  campaign: Campaign;
  sumAccredited: number;
  sumNonAccredited: number;

  constructor(campaign: Campaign, sumAccredited: number, sumNonAccredited: number) {
    this.campaign = campaign;
    this.sumAccredited = sumAccredited;
    this.sumNonAccredited = sumNonAccredited;
  }

  getTotalRaisedAmount() {
    return this.sumAccredited + this.sumNonAccredited;
  }

  // newInvestment variable to calculate campaign status after a investment is made
  isMaximumTargetAchieved(newInvestment = 0) {
    return this.isTargetAchieved(this.campaign.campaignTargetAmount, newInvestment);
  }

  isMinTargetAchieved(newInvestment = 0) {
    return this.isTargetAchieved(this.campaign.campaignMinimumAmount, newInvestment);
  }

  isTargetAchieved(target, newInvestment = 0) {
    return this.getTotalRaisedAmount() + newInvestment >= target;
  }

  isCampaignSuccessful(newInvestment = 0) {
    return (
      this.getTotalRaisedAmount() + newInvestment >= this.campaign.campaignMinimumAmount
    );
  }

  isAcceptingNewInvestments(newInvestment = 0) {
    if (this.isMaximumTargetAchieved()) {
      throw new CampaignMaximumGoalReachedException();
    }

    if (this.isMaximumTargetAchieved(newInvestment)) {
      if (
        this.getTotalRaisedAmount() + newInvestment >
        this.campaign.campaignTargetAmount
      ) {
        throw new InvestmentAmountExceedsCampaignMaximum();
      }
    }

    return true;
  }

  static createFromDetails({
    campaign,
    sumAccredited,
    sumNonAccredited,
  }: campaignStatusOptions) {
    return new CampaignStatusService(campaign, sumAccredited, sumNonAccredited);
  }
}

export default CampaignStatusService;
