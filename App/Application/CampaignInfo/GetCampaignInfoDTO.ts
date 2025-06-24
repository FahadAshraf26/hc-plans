import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetCampaignInfoDTO {
  private campaignId: string;
  private showTrashed: string;
  private paginationOptions: PaginationOptions;

  constructor(campaignId: string, showTrashed: string = 'false') {
    this.campaignId = campaignId;
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

export default GetCampaignInfoDTO;
