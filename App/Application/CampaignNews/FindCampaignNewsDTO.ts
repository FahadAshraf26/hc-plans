class FindCampaignNewsDTO {
  private campaignNewsId: string;

  constructor(campaignNewsId: string) {
    this.campaignNewsId = campaignNewsId;
  }

  getCampaignNewsId() {
    return this.campaignNewsId;
  }
}

export default FindCampaignNewsDTO;
