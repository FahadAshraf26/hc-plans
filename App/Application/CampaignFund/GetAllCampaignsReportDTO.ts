class GetAllCampaignsReportDTO {
  private readonly startDate: Date;
  private readonly endDate: Date;
  private readonly campaignNames: Array<string> = [];
  private readonly campaignStatuses: Array<string> = [];

  constructor(
    startDate: Date,
    endDate: Date,
    campaignNames: Array<string>,
    campaignStatuses: Array<string>,
  ) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.campaignNames = campaignNames;
    this.campaignStatuses = campaignStatuses;
  }

  getCampaignNames() {
    return this.campaignNames;
  }

  getCampaignStatuses() {
    return this.campaignStatuses;
  }

  getStartDate() {
    return new Date(this.startDate);
  }

  getEndDate() {
    return new Date(this.endDate);
  }
}

export default GetAllCampaignsReportDTO;
