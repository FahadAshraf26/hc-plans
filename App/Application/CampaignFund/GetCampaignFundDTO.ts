import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetCampaignFundDTO {
  private readonly campaignId: string;
  private readonly paginationOptions: PaginationOptions;
  private readonly showTrashed: string;
  private readonly query: any;

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

export default GetCampaignFundDTO;
