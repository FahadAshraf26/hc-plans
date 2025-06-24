export default class CreateFCDwollaTransactionsDTO {
  requestedBy: string;
  amount: number;

  constructor(requestedBy: string, amount: number) {
    this.requestedBy = requestedBy;
    this.amount = amount;
  }
}
