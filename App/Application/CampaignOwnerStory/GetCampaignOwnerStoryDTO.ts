import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetCampaignOwnerStoryDTO {
  private paginationOptions: PaginationOptions;
  private showTrashed: string;
  private campaignStage: string;
  private investorId: string;

  constructor(
    page: number,
    perPage: number,
    showTrashed: string = 'false',
    campaignStage: string,
    investorId: string,
  ) {
    this.paginationOptions = new PaginationOptions(page, perPage);
    this.showTrashed = showTrashed;
    this.campaignStage = campaignStage;
    this.investorId = investorId;
  }

  getPaginationOptions(): PaginationOptions {
    return this.paginationOptions;
  }

  isShowTrashed(): boolean {
    return typeof this.showTrashed === 'string'
      ? this.showTrashed === 'true'
      : this.showTrashed;
  }

  getCampaignStage(): string {
    return this.campaignStage;
  }

  getInvestorId(): string {
    return this.investorId;
  }
}
export default GetCampaignOwnerStoryDTO;
