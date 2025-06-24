class GetCampaignNPADTO {
  private campaignId: string;
  private invesmentType: string;

  constructor(campaignId: string,investmentType:string) {
    this.campaignId = campaignId;
    this.invesmentType = investmentType;
  }

  getCampaignId() {
    return this.campaignId;
  }

  getInvestmentType() {
    return this.invesmentType;
  }
}

export default GetCampaignNPADTO;
