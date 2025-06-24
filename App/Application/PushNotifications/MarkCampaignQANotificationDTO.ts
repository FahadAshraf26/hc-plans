class MarkCampaignQANotificationAsVisitedDTO {
  private readonly userId: string;
  private readonly campaignId: string;

  constructor(userId: string, campaignId: string) {
    this.userId = userId;
    this.campaignId = campaignId;
  }

  getUserId() {
    return this.userId;
  }

  getCampaignId() {
    return this.campaignId;
  }
}

export default MarkCampaignQANotificationAsVisitedDTO;
