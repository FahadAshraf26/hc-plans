class RemoveCampaignTagDTO {
  private campaignTagId: string;
  private hardDelete: string;

  constructor(campaignTagId: string, hardDelete: string = 'false') {
    this.campaignTagId = campaignTagId;
    this.hardDelete = hardDelete;
  }

  getCampaignTagId(): string {
    return this.campaignTagId;
  }

  shouldHardDelete(): boolean {
    return this.hardDelete === 'true';
  }
}

export default RemoveCampaignTagDTO;
