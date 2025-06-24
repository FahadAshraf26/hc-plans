class FindCampaignFundDTO {
  private readonly campaignFundId: string;

  constructor(campaignFundId: string) {
    this.campaignFundId = campaignFundId;
  }

  getCampaignFundId() {
    return this.campaignFundId;
  }
}

export default FindCampaignFundDTO;
