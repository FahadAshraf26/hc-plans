class InvestmentAmountExceedsCampaignMaximum extends Error {
  constructor() {
    super('campaignOverFundingLimit');
    Error.captureStackTrace(this, InvestmentAmountExceedsCampaignMaximum);
    this.name = 'InvestmentAmountExceedsCampaignMaximum';
  }
}

export default InvestmentAmountExceedsCampaignMaximum;
