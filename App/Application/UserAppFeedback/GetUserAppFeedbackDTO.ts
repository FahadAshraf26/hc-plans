import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetUserAppFeedbackDTO {
  showTrashed: string;
  userId: string;
  query: any;
  paginationOptions: PaginationOptions;

  constructor(
    userId: string,
    page: number,
    perPage: number,
    showTrashed: string = 'false',
    query = null,
  ) {
    this.showTrashed = showTrashed;
    this.userId = userId;
    this.query = query;
    this.paginationOptions = new PaginationOptions(page, perPage);
  }

  getUserId(): string {
    return this.userId;
  }

  getPaginationOptions(): PaginationOptions {
    return this.paginationOptions;
  }

  isShowTrashed(): boolean {
    return this.showTrashed === 'true';
  }

  getQuery(): string {
    return this.query;
  }
}

export default GetUserAppFeedbackDTO;
