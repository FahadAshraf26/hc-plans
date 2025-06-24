import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetUserNotificationsDTO {
  private readonly userId: string;
  private readonly paginationOptions: PaginationOptions;

  constructor(userId: string, page: number, perPage: number) {
    this.userId = userId;
    this.paginationOptions = new PaginationOptions(page, perPage);
  }

  getUserId() {
    return this.userId;
  }

  getPaginationOptions() {
    return this.paginationOptions;
  }
}

export default GetUserNotificationsDTO;
