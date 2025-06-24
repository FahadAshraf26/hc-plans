import PaginationOptions from '@domain/Utils/PaginationOptions';

class GetAllInvestorAccreditationsDTO {
  private readonly userId: string;
  private readonly wherePendingResult: string;
  private readonly showTrashed: string;
  private readonly paginationOptions: PaginationOptions;

  constructor(
    userId: string,
    page: number,
    perPage: number,
    wherePendingResult: string = 'false',
    showTrashed: string = 'false',
  ) {
    (this.userId = userId), (this.wherePendingResult = wherePendingResult);
    this.showTrashed = showTrashed;
    this.paginationOptions = new PaginationOptions(page, perPage);
  }

  getUserId() {
    return this.userId;
  }

  getPaginationOptions() {
    return this.paginationOptions;
  }

  isPendingResult() {
    return this.wherePendingResult === 'true';
  }

  isShowTrashed() {
    return this.showTrashed === 'true';
  }
}

export default GetAllInvestorAccreditationsDTO;
