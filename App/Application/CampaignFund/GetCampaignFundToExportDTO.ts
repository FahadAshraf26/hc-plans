class GetCampaignFundToExportDTO {
  private readonly campaignId: string;

  constructor(campaignId: string) {
    this.campaignId = campaignId;
  }

  getCampaignId() {
    return this.campaignId;
  }
}

export default GetCampaignFundToExportDTO;
