import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetCampaignNewsDTO {
  private campaignId: string;
  private paginationOptions: PaginationOptions;
  private showTrashed: string;
  private query: any;

  constructor(
    campaignId: string,
    page: number,
    perPage: number,
    showTrashed: string = 'false',
    query = null,
  ) {
    this.campaignId = campaignId;
    this.paginationOptions = new PaginationOptions(page, perPage);
    this.showTrashed = showTrashed;
    this.query = query;
  }

  getCampaignId() {
    return this.campaignId;
  }

  getPaginationOptions() {
    return this.paginationOptions;
  }

  isShowTrashed() {
    return this.showTrashed === 'true';
  }

  getQuery() {
    return this.query;
  }
}

export default GetCampaignNewsDTO;
