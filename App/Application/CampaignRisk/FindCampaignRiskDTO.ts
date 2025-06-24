class FindCampaignRiskDTO {
  private campaignRiskId: string;

  constructor(campaignRiskId: string) {
    this.campaignRiskId = campaignRiskId;
  }

  getCampaignRiskId(): string {
    return this.campaignRiskId;
  }
}

export default FindCampaignRiskDTO;
