import PaginationOptions from '@domain/Utils/PaginationOptions';

class GetUsersWithPreferencesDTO {
  page: number;
  perPage: number;
  private readonly searchQuery: string;
  paginationOptions: PaginationOptions;

  constructor(page: number = 1, perPage: number = 50, searchQuery: string = '') {
    this.page = page;
    this.perPage = perPage;
    this.searchQuery = searchQuery?.trim() || '';
    this.paginationOptions = new PaginationOptions(page, perPage);
  }

  getPaginationOptions() {
    return this.paginationOptions;
  }

  getSearchQuery(): string {
    return this.searchQuery;
  }

  hasSearchQuery(): boolean {
    return this.searchQuery.length > 0;
  }
}

export default GetUsersWithPreferencesDTO;
