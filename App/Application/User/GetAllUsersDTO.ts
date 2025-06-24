import PaginationOptions from '@domain/Utils/PaginationOptions';

class GetAllUsersDTO {
  private readonly showTrashed: string;
  private readonly owner: string;
  private readonly paginationOptions: PaginationOptions;
  private readonly query: string;
  private readonly ownerQuery: string;

  constructor(
    page: number,
    perPage: number,
    showTrashed: string = 'false',
    owner: string = 'false',
    query: string = null,
    ownerQuery: string = null,
  ) {
    this.showTrashed = showTrashed;
    this.owner = owner;
    this.paginationOptions = new PaginationOptions(page, perPage);
    this.query = query;
    this.ownerQuery = ownerQuery;
  }

  getPaginationOptions() {
    return this.paginationOptions;
  }

  isShowTrashed() {
    return this.showTrashed === 'true';
  }

  isOwner() {
    return this.owner === 'true';
  }

  getQuery() {
    return this.query;
  }

  getOwnerQuery() {
    return this.ownerQuery;
  }
}

export default GetAllUsersDTO;
