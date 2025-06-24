import PaginationOptions from '../../../Domain/Utils/PaginationOptions';

class GetFavoriteCampaignDTO {
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
    this.paginationOptions = new PaginationOptions(page, perPage);
    this.userId = userId;
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
}

export default GetFavoriteCampaignDTO;
