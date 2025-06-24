import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetCampaignNotesDTO {
  private readonly campaignId: string;
  private readonly showTrashed: string;
  private readonly paginationOptions: PaginationOptions;

  constructor(campaignId: string, page: number, perPage: number, showTrashed: string) {
    this.campaignId = campaignId;
    this.showTrashed = showTrashed;
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
}

export default GetCampaignNotesDTO;
