import PaginationOptions from '@domain/Utils/PaginationOptions';
class GetAllWebhookResponsesDTO {
  private paginationOptions: any;
  private showTrashed: string;
  private query: any;
  private dwollaCustomerId: string;
  private customerType: string;
  private userId: string;

  constructor(
    page: number,
    perPage: number,
    showTrashed: string = 'false',
    query: any = null,
    dwollaCustomerId: string,
    customerType: string,
    userId: string,
  ) {
    this.paginationOptions = new PaginationOptions(page, perPage);
    this.showTrashed = showTrashed;
    this.query = query;
    this.dwollaCustomerId = dwollaCustomerId;
    this.customerType = customerType;
    this.userId = userId;
  }

  getPaginationOptions() {
    return this.paginationOptions;
  }

  isShowTrashed() {
    return this.showTrashed === 'true';
  }

  getQuery() {
    return this.query;
  }
  getDwollaCustomerId() {
    return this.dwollaCustomerId;
  }

  getCustomerType() {
    return this.customerType;
  }

  getUserId() {
    return this.userId;
  }
}

export default GetAllWebhookResponsesDTO;
