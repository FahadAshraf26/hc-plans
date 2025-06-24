import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetAdminDTO {
  private paginationOptions: PaginationOptions;

  constructor(page: number, perPage: number) {
    this.paginationOptions = new PaginationOptions(page, perPage);
  }

  getPaginationOptions(): PaginationOptions {
    return this.paginationOptions;
  }
}

export default GetAdminDTO;
