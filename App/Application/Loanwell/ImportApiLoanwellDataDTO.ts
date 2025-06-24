class ImportApiLoanwellDataDTO {
  private campaignName: string[];

  constructor(campaignName: string[]) {
    this.campaignName = campaignName;
  }

  getCampaignName() {
    return this.campaignName;
  }
}

export default ImportApiLoanwellDataDTO;
