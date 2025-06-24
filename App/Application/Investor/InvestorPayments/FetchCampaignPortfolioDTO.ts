export class FetchCampaignPortfolioDTO {
  private readonly investorId: string;
  private readonly campaignId: string;
  private readonly entityId: string;
  constructor(investorId: string, campaignId: string,entityId = null) {
    this.investorId = investorId;
    this.campaignId = campaignId;
    this.entityId = entityId;
  }

  getInvestorId() {
    return this.investorId;
  }

  getCampaignId() {
    return this.campaignId;
  }

  getEntityId() {
    return this.entityId;
  }
}
