class FindCampaignOwnerStoryDTO {
  private campaignOwnerStoryId: string;

  constructor(campaignOwnerStoryId: string) {
    this.campaignOwnerStoryId = campaignOwnerStoryId;
  }

  getCampaignOwnerStoryId(): string {
    return this.campaignOwnerStoryId;
  }
}

export default FindCampaignOwnerStoryDTO;
