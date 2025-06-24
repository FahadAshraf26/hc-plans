export class FetchInvestorPaymentsDTO {
  private readonly userId: string;
  constructor(userId: string) {
    this.userId = userId;
  }

  getUserId() {
    return this.userId;
  }
}
