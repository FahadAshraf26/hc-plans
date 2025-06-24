import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetUncaughtExceptionsDTO {
  private paginationOptions: PaginationOptions;
  private query: any;
  constructor(page: number, perPage: number, query: any) {
    this.paginationOptions = new PaginationOptions(page, perPage);
    this.query = query;
  }

  getPaginationOptions() {
    return this.paginationOptions;
  }

  getQuery() {
    return this.query;
  }
}

export default GetUncaughtExceptionsDTO;
