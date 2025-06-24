import PaginationOptions from '@domain/Utils/PaginationOptions';

class GetUserWithkycDTO {
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
    this.userId = userId;
    this.paginationOptions = new PaginationOptions(page, perPage);
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

export default GetUserWithkycDTO;
