import PaginationOptions from '@domain/Utils/PaginationOptions';

class FetchAllDwollaToBankTransactionsDTO {
  private paginationOptions: PaginationOptions;
  private query: string;

  constructor(page: number, perPage: number, query: string) {
    this.paginationOptions = new PaginationOptions(page, perPage);
    this.query = query;
  }

  getPaginationOptions(): PaginationOptions {
    return this.paginationOptions;
  }

  getQuery() {
    return this.query;
  }
}

export default FetchAllDwollaToBankTransactionsDTO;
