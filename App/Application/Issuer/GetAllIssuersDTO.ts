import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetAllIssuersDTO {
  private paginationOptions: any;
  private showTrashed: string;
  private query: any;

  constructor(
    page: number,
    perPage: number,
    showTrashed: string = 'false',
    query: any = null,
  ) {
    this.paginationOptions = new PaginationOptions(page, perPage);
    this.showTrashed = showTrashed;
    this.query = query;
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

export default GetAllIssuersDTO;
