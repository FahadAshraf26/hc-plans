import PaginationOptions from '@domain/Utils/PaginationOptions';

class GetUserDocumentsDTO {
  private readonly userId: string;
  private readonly showTrashed: boolean;
  private readonly query: string;
  private readonly paginationOptions: PaginationOptions;
  private isAdminRequest?: boolean;

  constructor(
    userId: string,
    page: number,
    perPage: number,
    showTrashed: boolean = false,
    query: string = null,
  ) {
    this.showTrashed = showTrashed;
    this.userId = userId;
    this.query = query;
    this.paginationOptions = new PaginationOptions(page, perPage);
  }

  setIsAdminRequest(requestOrigin) {
    this.isAdminRequest = requestOrigin === 'ap' ? true : false 
  }

  getIsAdminRequest() {
    return this.isAdminRequest;
  }

  getUserId() {
    return this.userId;
  }

  getPaginationOptions() {
    return this.paginationOptions;
  }

  isShowTrashed() {
    return this.showTrashed === true;
  }

  getQuery() {
    return this.query;
  }
}

export default GetUserDocumentsDTO;
