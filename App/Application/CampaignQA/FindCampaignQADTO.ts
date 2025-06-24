class FindCampaignQADTO {
  private campaignQAId: string;

  constructor(campaignQAId: string) {
    this.campaignQAId = campaignQAId;
  }

  getCampaignQAId(): string {
    return this.campaignQAId;
  }
}

export default FindCampaignQADTO;
