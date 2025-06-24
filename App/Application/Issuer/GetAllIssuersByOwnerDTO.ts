import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetAllIssuersByOwnerDTO {
  private ownerId: string;
  private paginationOptions: any;
  private showTrashed: string;

  constructor(
    ownerId: string,
    page: number,
    perPage: number,
    showTrashed: string = 'false',
  ) {
    this.ownerId = ownerId;
    this.paginationOptions = new PaginationOptions(page, perPage);
    this.showTrashed = showTrashed;
  }

  getOwnerId() {
    return this.ownerId;
  }

  getPaginationOptions() {
    return this.paginationOptions;
  }

  isShowTrashed() {
    return this.showTrashed === 'true' ? true : false;
  }
}

export default GetAllIssuersByOwnerDTO;
