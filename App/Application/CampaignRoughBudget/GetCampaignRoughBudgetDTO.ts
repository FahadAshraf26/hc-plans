import PaginationOptions from '@domain/Utils/PaginationOptions';

class GetCampaignRoughBudgetDTO {
  private readonly campaignId: string;
  private readonly showTrashed: string;
  private paginationOptions: PaginationOptions;

  constructor(campaignId: string, showTrashed: string = 'false') {
    this.campaignId = campaignId;
    this.showTrashed = showTrashed;
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

export default GetCampaignRoughBudgetDTO;
