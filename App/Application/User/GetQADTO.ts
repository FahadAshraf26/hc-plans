import PaginationOptions from '@domain/Utils/PaginationOptions';

class GetQADTO {
  private readonly userId: string;
  private readonly showTrashed: string;
  private readonly paginationOptions: PaginationOptions;

  constructor(
    userId: string,
    page: number,
    perPage: number,
    showTrashed: string = 'false',
  ) {
    this.showTrashed = showTrashed;
    this.paginationOptions = new PaginationOptions(page, perPage);
    this.userId = userId;
  }

  getUserId() {
    return this.userId;
  }

  getPaginationOptions() {
    return this.paginationOptions;
  }

  isShowTrashed() {
    return this.showTrashed === 'true';
  }
}

export default GetQADTO;
