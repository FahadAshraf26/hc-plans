import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetCampaignDocumentsDTO {
  private showTrashed: string;
  private query: any;
  private campaignId: string;
  private paginationOptions: PaginationOptions;

  constructor(
    campaignId: string,
    page: number,
    perPage: number,
    showTrashed: string = 'false',
    query = null,
  ) {
    this.showTrashed = showTrashed;
    this.query = query;
    this.campaignId = campaignId;
    this.paginationOptions = new PaginationOptions(page, perPage);
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

export default GetCampaignDocumentsDTO;
