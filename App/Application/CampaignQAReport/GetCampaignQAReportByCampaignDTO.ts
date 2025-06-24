import PaginationOptions from '@domain/Utils/PaginationOptions';

class GetCampaignQAReportByCampaignQADTO {
  private campaignQAId: string;
  private paginationOptions: PaginationOptions;
  private showTrashed: string;

  constructor(
    campaignQAId: string,
    page: number,
    perPage: number,
    showTrashed: string = 'false',
  ) {
    this.campaignQAId = campaignQAId;
    this.paginationOptions = new PaginationOptions(page, perPage);
    this.showTrashed = showTrashed;
  }

  getCampaignQAId() {
    return this.campaignQAId;
  }

  getPaginationOptions() {
    return this.paginationOptions;
  }

  isShowTrashed() {
    return this.showTrashed === 'true';
  }
}

export default GetCampaignQAReportByCampaignQADTO;
