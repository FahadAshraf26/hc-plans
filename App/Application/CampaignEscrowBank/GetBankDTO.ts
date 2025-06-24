class GetBankDTO {
  private campaignId: string;

  constructor(campaignId) {
    this.campaignId = campaignId;
  }

  getCampaignId() {
    return this.campaignId;
  }
}

export default GetBankDTO;
