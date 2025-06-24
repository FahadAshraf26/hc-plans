class RemoveCampaignDocumentDTO {
  private campaignDocumentId: string;
  private hardDelete: string;

  constructor(campaignDocumentId: string, hardDelete: string = 'false') {
    this.campaignDocumentId = campaignDocumentId;
    this.hardDelete = hardDelete;
  }

  getCampaignDocumentId() {
    return this.campaignDocumentId;
  }

  shouldHardDelete() {
    return this.hardDelete === 'true';
  }
}

export default RemoveCampaignDocumentDTO;
