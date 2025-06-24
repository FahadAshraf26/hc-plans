class CreateChargeDTO {
  private readonly campaignId: string;
  private readonly campaignFundId: string;

  constructor(campaignId: string, campaignFundId: string) {
    this.campaignId = campaignId;
    this.campaignFundId = campaignFundId;
  }

  getCampaignId() {
    return this.campaignId;
  }

  getCampaignFundId() {
    return this.campaignFundId;
  }
}

export default CreateChargeDTO;
