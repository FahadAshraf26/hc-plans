import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetAllTagDTO {
  page: number;
  perPage: number;
  private readonly showTrashed: string;
  private readonly query: any;
  paginationOptions: PaginationOptions;

  constructor(page: number, perPage: number, showTrashed: string, query: any = null) {
    this.showTrashed = showTrashed;
    this.query = query;
    this.paginationOptions = new PaginationOptions(page, perPage);
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

export default GetAllTagDTO;
