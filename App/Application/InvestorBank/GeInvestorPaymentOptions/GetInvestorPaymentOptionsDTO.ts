import PaginationOptions from '../../../Domain/Utils/PaginationOptions';

class GetInvestorPaymentOptionsDTO {
  private userId: string;
  private paginationOptions: PaginationOptions;
  private showTrashed: string;

  constructor(
    userId: string,
    page: number,
    perPage: number,
    showTrashed: string = 'false',
  ) {
    this.userId = userId;
    this.paginationOptions = new PaginationOptions(page, perPage);
    this.showTrashed = showTrashed;
  }

  getUserId(): string {
    return this.userId;
  }

  getPaginationOptions(): PaginationOptions {
    return this.paginationOptions;
  }

  shouldShowTrashed(): boolean {
    return this.showTrashed === 'true';
  }
}

export default GetInvestorPaymentOptionsDTO;
