class FindCampaignInfoDTO {
  private campaignInfoId: string;

  constructor(campaignInfoId: string) {
    this.campaignInfoId = campaignInfoId;
  }

  getCampaignInfoId(): string {
    return this.campaignInfoId;
  }
}

export default FindCampaignInfoDTO;
