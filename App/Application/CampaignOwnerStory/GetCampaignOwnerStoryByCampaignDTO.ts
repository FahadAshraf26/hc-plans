import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetCampaignOwnerStoryByCampaignDTO {
  private paginationOptions: PaginationOptions;
  private showTrashed: string;
  private campaignId: string;

  constructor(
    page: number,
    perPage: number,
    showTrashed: string = 'false',
    campaignId: string,
  ) {
    this.paginationOptions = new PaginationOptions(page, perPage);
    this.showTrashed = showTrashed;
    this.campaignId = campaignId;
  }

  getPaginationOptions(): PaginationOptions {
    return this.paginationOptions;
  }

  isShowTrashed(): boolean {
    return typeof this.showTrashed === 'string'
      ? this.showTrashed === 'true'
      : this.showTrashed;
  }

  getCampaignId(): string {
    return this.campaignId;
  }
}

export default GetCampaignOwnerStoryByCampaignDTO;
