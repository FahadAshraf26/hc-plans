import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetFavoriteCampaignDTO {
  private investorId: string;
  private page: number;
  private perPage: number;
  private showTrashed: boolean;
  private paginationOptions: PaginationOptions;

  constructor(
    investorId: string,
    page: number,
    perPage: number,
    showTrashed: boolean = false,
  ) {
    this.investorId = investorId;
    this.paginationOptions = new PaginationOptions(page, perPage);
    this.showTrashed = showTrashed;
  }

  getInvestorId() {
    return this.investorId;
  }

  getPaginationOptions() {
    return this.paginationOptions;
  }

  isShowTrashed() {
    return this.showTrashed === true;
  }
}

export default GetFavoriteCampaignDTO;
