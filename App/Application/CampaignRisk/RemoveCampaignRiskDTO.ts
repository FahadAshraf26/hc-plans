class RemoveCampaignRiskDTO {
  private campaignRiskId: string;
  private hardDelete: string;

  constructor(campaignRiskId: string, hardDelete: string) {
    this.campaignRiskId = campaignRiskId;
    this.hardDelete = hardDelete;
  }

  getCampaignRiskId(): string {
    return this.campaignRiskId;
  }

  shouldHardDeleted(): boolean {
    return this.hardDelete === 'true';
  }
}

export default RemoveCampaignRiskDTO;
