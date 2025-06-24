class FindCampaignFundDTO {
  private readonly campaignFundId: string;
  private hardDelete: boolean;
  private readonly campaignId: string;

  constructor(campaignFundId: string, campaignId: string, hardDelete: boolean = false) {
    this.campaignFundId = campaignFundId;
    this.hardDelete = hardDelete;
    this.campaignId = campaignId;
  }

  getCampaignFundId() {
    return this.campaignFundId;
  }

  getCampaignId() {
    return this.campaignId;
  }

  shouldHardDelete() {
    return (this.hardDelete = !!'true');
  }
}

export default FindCampaignFundDTO;
