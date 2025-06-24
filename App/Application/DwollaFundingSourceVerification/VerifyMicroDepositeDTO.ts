class VerifyMicroDepositeDTO {
  private dwollaSourceId: string;
  private firstAmount: number;
  private secondAmount: number;

  constructor(dwollaSourceId: string, firstAmount: number, secondAmount: number) {
    this.dwollaSourceId = dwollaSourceId;
    this.firstAmount = firstAmount;
    this.secondAmount = secondAmount;
  }

  getDwollaSourceId() {
    return this.dwollaSourceId;
  }

  getFirstAmount() {
    return this.firstAmount;
  }

  getSecondAmount() {
    return this.secondAmount;
  }
}

export default VerifyMicroDepositeDTO;
