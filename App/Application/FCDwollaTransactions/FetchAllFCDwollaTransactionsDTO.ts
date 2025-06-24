import PaginationOptions from '@domain/Utils/PaginationOptions';

export default class FetchAllFCDwollaTransactionsDTO {
  paginationOptions: PaginationOptions;

  constructor(page: number, perPage: number) {
    this.paginationOptions = new PaginationOptions(Number(page), Number(perPage));
  }
}
