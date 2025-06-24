class RemoveCampaignQA {
  private campaignQAId: string;
  private hardDelete: string;

  constructor(campaignQAId: string, hardDelete: string = 'false') {
    this.campaignQAId = campaignQAId;
    this.hardDelete = hardDelete;
  }

  getCampaignQAId(): string {
    return this.campaignQAId;
  }

  shouldHardDelete(): boolean {
    return this.hardDelete === 'true';
  }
}

export default RemoveCampaignQA;
