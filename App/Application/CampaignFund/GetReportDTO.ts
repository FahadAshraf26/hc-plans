class GetReportDTO {
  private readonly startDate: Date;
  private readonly endDate: Date;
  private readonly campaignId: string;

  constructor(startDate: Date, endDate: Date, campaignId: string) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.campaignId = campaignId;
  }

  getCampaignId() {
    return this.campaignId;
  }

  getStartDate() {
    return new Date(this.startDate);
  }

  getEndDate() {
    return new Date(this.endDate);
  }
}

export default GetReportDTO;
