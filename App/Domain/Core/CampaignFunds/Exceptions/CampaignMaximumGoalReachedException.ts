class CampaignMaximumGoalReachedException extends Error {
  constructor() {
    super('campaignOverFundingLimit');
    Error.captureStackTrace(this, CampaignMaximumGoalReachedException);
    this.name = 'CampaignMaximumGoalReachedException';
  }
}

export default CampaignMaximumGoalReachedException;
