class RemoveCampaignNotesDTO {
  private readonly campaignNotesId: string;
  private readonly hardDelete: string;

  constructor(campaignNotesId: string, hardDelete: string) {
    this.campaignNotesId = campaignNotesId;
    this.hardDelete = hardDelete;
  }

  getCampaignNotesId() {
    return this.campaignNotesId;
  }

  shouldHardDeleted() {
    return this.hardDelete === 'true';
  }
}

export default RemoveCampaignNotesDTO;
