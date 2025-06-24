class FindCampaignMediaDTO {
  private campaignMediaId: string;

  constructor(campaignMediaId: string) {
    this.campaignMediaId = campaignMediaId;
  }

  getCampaignMediaId(): string {
    return this.campaignMediaId;
  }
}

export default FindCampaignMediaDTO;
