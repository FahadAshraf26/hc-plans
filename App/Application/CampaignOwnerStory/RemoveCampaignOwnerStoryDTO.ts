class RemoveCampaignOwnerStoryDTO {
  private campaignOwnerStoryId: string;
  private hardDelete: string;

  constructor(campaignOwnerStoryId: string, hardDelete: string) {
    this.campaignOwnerStoryId = campaignOwnerStoryId;
    this.hardDelete = hardDelete;
  }

  getCampaignOwnerStoryId(): string {
    return this.campaignOwnerStoryId;
  }

  shouldHardDeleted(): boolean {
    return this.hardDelete === 'true';
  }
}

export default RemoveCampaignOwnerStoryDTO;
