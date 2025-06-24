class CreateDwollaToBankTransactionDTO {
  private readonly userId: string;
  private readonly dwollaSourceId: string;
  private readonly dwollaBalanceId: string;
  private readonly amount: string;

  constructor(
    userId: string,
    dwollaSourceId: string,
    dwollaBalanceId: string,
    amount: string,
  ) {
    this.userId = userId;
    this.dwollaSourceId = dwollaSourceId;
    this.dwollaBalanceId = dwollaBalanceId;
    this.amount = amount;
  }

  getUserId(): string {
    return this.userId;
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

export default CreateDwollaToBankTransactionDTO;
