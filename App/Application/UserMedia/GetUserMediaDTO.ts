import PaginationOptions from '@domain/Utils/PaginationOptions';

class GetUserMediaDTO {
  private userId: string;
  private query: any;
  showTrashed: boolean;
  private paginationOptions: PaginationOptions;

  constructor(userId, page, perPage, query, showTrashed = false) {
    this.showTrashed = showTrashed;
    this.userId = userId;
    this.query = query;
    this.paginationOptions = new PaginationOptions(page, perPage);
  }

  getUserId() {
    return this.userId;
  }

  getQuery() {
    return this.query;
  }

  getPaginationOptions() {
    return this.paginationOptions;
  }

  isShowTrashed() {
    return typeof this.showTrashed === 'string'
      ? this.showTrashed === 'true'
      : this.showTrashed;
  }
}

export default GetUserMediaDTO;
