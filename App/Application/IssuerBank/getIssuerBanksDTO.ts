import PaginationOptions from '@domain/Utils/PaginationOptions';

class GetIssuerBanksDTO {
  private issuerId: string;
  private paginationOptions: PaginationOptions;
  private showTrashed: boolean;
  private includeWallet: boolean;
  /**
   *
   * @param {string} issuerId
   * @param {number} page
   * @param {number} perPage
   * @param {(boolean | string)} showTrashed
   * @param {(boolean | string)} includeWallet
   */
  constructor(
    issuerId: string,
    page: number,
    perPage: number,
    showTrashed: boolean = false,
    includeWallet: boolean = false,
  ) {
    this.issuerId = issuerId;
    this.paginationOptions = new PaginationOptions(page, perPage);
    this.showTrashed = showTrashed;
    this.includeWallet = includeWallet;
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

  isIncludeWallet() {
    return this.includeWallet === true;
  }
}

export default GetIssuerBanksDTO;
