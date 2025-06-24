import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetNAICDTO {
  private readonly paginationOptions: PaginationOptions;
  private readonly query: string;

  constructor(page: number, perPage: number, query: string = null) {
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

export default GetNAICDTO;
