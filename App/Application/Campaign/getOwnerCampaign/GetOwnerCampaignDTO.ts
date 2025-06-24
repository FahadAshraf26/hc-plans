import PaginationOptions from '../../../Domain/Utils/PaginationOptions';

class UserCampaignsDTO {
  private userId: string;
  private paginationOptions: PaginationOptions;

  constructor(userId: string, page: number = 1, perPage: number = 10) {
    this.userId = userId;
    this.paginationOptions = new PaginationOptions(page, perPage);
  }

  getUserId(): string {
    return this.userId;
  }

  getPaginationOptions(): PaginationOptions {
    return this.paginationOptions;
  }
}

export default UserCampaignsDTO;
