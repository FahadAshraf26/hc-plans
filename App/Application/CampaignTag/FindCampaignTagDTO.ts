class FindCampaignTagDTO {
  private campaignTagId: string;

  constructor(campaignTagId: string) {
    this.campaignTagId = campaignTagId;
  }

  getCampaignTagId(): string {
    return this.campaignTagId;
  }
}

export default FindCampaignTagDTO;
