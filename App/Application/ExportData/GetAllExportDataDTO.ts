import PaginationOptions from '@domain/Utils/PaginationOptions';

class GetAllExportDataDTO {
  private paginationOptions: PaginationOptions;
  constructor(page: number, perPage: number) {
    this.paginationOptions = new PaginationOptions(page, perPage);
  }

  getPaginationOptions() {
    return this.paginationOptions;
  }
  
}

export default GetAllExportDataDTO;
