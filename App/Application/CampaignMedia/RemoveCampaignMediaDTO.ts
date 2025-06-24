class RemoveCampaignMediaDTO {
  private campaignMediaId: string;
  private hardDelete: string;

  constructor(campaignMediaId: string, hardDelete: string) {
    this.campaignMediaId = campaignMediaId;
    this.hardDelete = hardDelete;
  }

  getCampaignMediaId(): string {
    return this.campaignMediaId;
  }

  shouldHardDelete(): boolean {
    return this.hardDelete === 'true';
  }
}

export default RemoveCampaignMediaDTO;
