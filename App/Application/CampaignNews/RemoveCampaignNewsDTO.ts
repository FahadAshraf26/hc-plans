class RemoveCampaignNewsDTO {
  private campaignNewsId: string;
  private hardDelete: boolean;

  constructor(campaignNewsId: string, hardDelete: boolean = false) {
    this.campaignNewsId = campaignNewsId;
    this.hardDelete = hardDelete;
  }

  getCampaignNewsId() {
    return this.campaignNewsId;
  }

  shouldHardDelete() {
    return (this.hardDelete = !!'true');
  }
}

export default RemoveCampaignNewsDTO;
