class RemoveCampaignInfoDTO {
  private campaignInfoId: string;
  private hardDelete: string;

  constructor(campaignInfoId: string, hardDelete: string = 'false') {
    this.campaignInfoId = campaignInfoId;
    this.hardDelete = hardDelete;
  }

  getCampaignInfoId() {
    return this.campaignInfoId;
  }

  shouldHardDelete() {
    return this.hardDelete === 'true';
  }
}

export default RemoveCampaignInfoDTO;
