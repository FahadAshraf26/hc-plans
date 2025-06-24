class RemoveCampaignDTO {
  campaignId: string;
  hardDelete: boolean;

  constructor(campaignId: string, hardDelete: boolean) {
    this.campaignId = campaignId;
    this.hardDelete = hardDelete;
  }

  getCampaignId() {
    return this.campaignId;
  }

  shouldHardDelete() {
    return this.hardDelete === true;
  }
}

export default RemoveCampaignDTO;
