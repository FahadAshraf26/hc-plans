import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetEmployeesDTO {
  private issuerId?: string | undefined;
  private showTrashed: string;
  private query: any;
  private paginationOptions: PaginationOptions;

  constructor(
    issuerId: string | undefined,
    page: number,
    perPage: number,
    showTrashed = 'false',
    query = null,
  ) {
    this.showTrashed = showTrashed;
    this.issuerId = issuerId;
    this.query = query;
    this.paginationOptions = new PaginationOptions(page, perPage);
  }

  getIssuerId() {
    return this.issuerId;
  }

  getPaginationOptions() {
    return this.paginationOptions;
  }

  isShowTrashed() {
    return this.showTrashed === 'true';
  }

  getQuery() {
    return this.query;
  }
}

export default GetEmployeesDTO;
