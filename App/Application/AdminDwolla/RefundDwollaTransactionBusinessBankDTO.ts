class RefundDwollaTransactionBusinessBankDTO {
  private readonly dwollaSourceId: string;
  private readonly dwollaBalanceId: string;
  private readonly amount: string;

  constructor(
    dwollaSourceId: string,
    dwollaBalanceId: string,
    amount: string,
  ) {
    this.dwollaSourceId = dwollaSourceId;
    this.dwollaBalanceId = dwollaBalanceId;
    this.amount = amount;
  }

  getDwollaSourceId(): string {
    return this.dwollaSourceId;
  }

  getDwollaBalanceId(): string {
    return this.dwollaBalanceId;
  }

  getAmount(): number {
    return parseFloat(this.amount);
  }
}

export default RefundDwollaTransactionBusinessBankDTO;
