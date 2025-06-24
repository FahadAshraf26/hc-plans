import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetCampaignsWithRepaymentsDTO {
  private search: string;
  private paginationOptions: PaginationOptions;

  constructor(search: string, page: number = 1, perPage: number = 10) {
    this.search = search;
    this.paginationOptions = new PaginationOptions(page, perPage);
  }

  getPaginationOptions(): PaginationOptions {
    return this.paginationOptions;
  }

  getSearch(): string{
    return this.search;
  }
}

export default GetCampaignsWithRepaymentsDTO;
