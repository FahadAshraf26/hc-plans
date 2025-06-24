import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetIssuerDocumentsDTO {
  private showTrashed: boolean;
  private query: any;
  private issuerId: string;
  private paginationOptions: PaginationOptions;

  constructor(
    issuerId: string,
    page: number,
    perPage: number,
    showTrashed = false,
    query = null,
  ) {
    this.showTrashed = showTrashed;
    this.query = query;
    this.issuerId = issuerId;
    this.paginationOptions = new PaginationOptions(page, perPage);
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

  getQuery() {
    return this.query;
  }
}

export default GetIssuerDocumentsDTO;
