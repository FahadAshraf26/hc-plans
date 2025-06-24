import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetCampaignRiskDTO {
  private campaignId: string;
  private showTrashed: string;
  private query: any;
  private paginationOptions: PaginationOptions;

  constructor(
    campaignId: string,
    page: number,
    perPage: number,
    showTrashed: string,
    query = null,
  ) {
    this.campaignId = campaignId;
    this.showTrashed = showTrashed;
    this.query = query;
    this.paginationOptions = new PaginationOptions(page, perPage);
  }

  getCampaignId(): string {
    return this.campaignId;
  }

  getPaginationOptions(): PaginationOptions {
    return this.paginationOptions;
  }

  isShowTrashed(): boolean {
    return this.showTrashed === 'true';
  }

  getQuery() {
    return this.query;
  }
}

export default GetCampaignRiskDTO;
