import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetCampaignNewsReportByCampaignNewsDTO {
  private campaignNewsId: string;
  private paginationOptions: PaginationOptions;
  private showTrashed: string;

  constructor(
    campaignNewsId: string,
    page: number,
    perPage: number,
    showTrashed: string = 'false',
  ) {
    this.campaignNewsId = campaignNewsId;
    this.paginationOptions = new PaginationOptions(page, perPage);
    this.showTrashed = showTrashed;
  }

  getCampaignNewsId() {
    return this.campaignNewsId;
  }

  getPaginationOptions() {
    return this.paginationOptions;
  }

  isShowTrashed() {
    return this.showTrashed === 'true';
  }
}

export default GetCampaignNewsReportByCampaignNewsDTO;
