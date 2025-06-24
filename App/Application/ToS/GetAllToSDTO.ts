import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetAllToSDTO {
  private showTrashed: string;
  private paginationOptions: PaginationOptions;

  constructor(page: number, perPage: number, showTrashed: string) {
    this.showTrashed = showTrashed;
    this.paginationOptions = new PaginationOptions(page, perPage);
  }

  getPaginationOptions() {
    return this.paginationOptions;
  }

  isShowTrashed(): boolean {
    return this.showTrashed === 'true';
  }
}

export default GetAllToSDTO;
