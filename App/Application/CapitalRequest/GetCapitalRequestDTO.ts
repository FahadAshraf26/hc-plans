import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetCapitalRequestsDTO {
  showTrashed: string;
  paginationOptions: PaginationOptions;

  constructor(page: number, perPage: number, showTrashed: string) {
    this.showTrashed = showTrashed;
    this.paginationOptions = new PaginationOptions(page, perPage);
  }

  getPaginationOptions() {
    return this.paginationOptions;
  }

  isShowTrashed() {
    return this.showTrashed === 'true';
  }
}

export default GetCapitalRequestsDTO;
