import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetCampaignMediaDTO {
  campaignId: string;
  showTrashed: string;
  paginationOptions: PaginationOptions;

  constructor(campaignId: string, page: number, perPage: number, showTrashed: string) {
    this.campaignId = campaignId;
    this.showTrashed = showTrashed;
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
}

export default GetCampaignMediaDTO;
