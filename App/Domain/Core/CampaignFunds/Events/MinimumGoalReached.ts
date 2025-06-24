import CampaignFund from '../CampaignFund';

class MinimumGoalReached {
  private campaignFund: CampaignFund;
  dateTimeOccured: Date;
  /**
   *
   * @param {CampaignFund} campaignFund
   */
  constructor(campaignFund: CampaignFund) {
    this.dateTimeOccured = new Date();
    this.campaignFund = campaignFund;
  }

  /**
   * @returns {string}
   */
  getAggregateId() {
    return this.campaignFund.campaignFundId;
  }
}

export default MinimumGoalReached;
