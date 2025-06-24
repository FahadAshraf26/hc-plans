class CreateCampaignFavoriteDTO {
  private campaignId: string;
  private investorId: string;
  private hardDelete: string;

  constructor(campaignId: string, investorId: string, hardDelete: string = 'false') {
    this.campaignId = campaignId;
    this.investorId = investorId;
    this.hardDelete = hardDelete;
  }

  getCampaignId(): string {
    return this.campaignId;
  }

  getInvestorId(): string {
    return this.investorId;
  }

  shouldHardDelete(): boolean {
    return this.hardDelete === 'true';
  }
}

export default CreateCampaignFavoriteDTO;
