class FindCampaignDocumentDTO {
  private campaignDocumentId: string;

  constructor(campaignDocumentId: string) {
    this.campaignDocumentId = campaignDocumentId;
  }

  getCampaignDocumentId() {
    return this.campaignDocumentId;
  }
}

export default FindCampaignDocumentDTO;
