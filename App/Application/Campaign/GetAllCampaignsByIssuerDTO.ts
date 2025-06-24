import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetAllCampaignsDTO {
  private issuerId: string;
  private investorId: string;
  private page: number;
  private perPage: number;
  private showTrashed: boolean;
  private paginationOptions: PaginationOptions;
  /**
   *
   * @param {string} issuerId
   * @param {string} investorId
   * @param {number} page
   * @param {number} perPage
   * @param {(boolean|"true"|"false")} showTrashed
   */
  constructor(
    issuerId: string,
    investorId: string,
    page: number,
    perPage: number,
    showTrashed = false,
  ) {
    this.issuerId = issuerId;
    this.paginationOptions = new PaginationOptions(page, perPage);
    this.showTrashed = showTrashed;
    this.investorId = investorId;
  }

  getInvestorId() {
    return this.investorId;
  }

  getIssuerId() {
    return this.issuerId;
  }

  getPaginationOptions() {
    return this.paginationOptions;
  }

  isShowTrashed() {
    return this.showTrashed === true;
  }
}

export default GetAllCampaignsDTO;
