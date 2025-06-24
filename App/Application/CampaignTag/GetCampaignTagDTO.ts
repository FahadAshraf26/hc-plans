import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetCampainTagDTO {
  private campaignId: string;
  private paginationOptions: PaginationOptions;
  private showTrashed: string;

  constructor(
    campaignId: string,
    page: number,
    perPage: number,
    showTrashed: string = 'false',
  ) {
    this.campaignId = campaignId;
    this.paginationOptions = new PaginationOptions(page, perPage);
    this.showTrashed = showTrashed;
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
}

export default GetCampainTagDTO;
