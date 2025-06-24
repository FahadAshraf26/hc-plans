class LinkCreditCardDTO {
  private userId: string;
  private accountId: string;

  constructor(userId, accountId) {
    this.userId = userId;
    this.accountId = accountId;
  }

  getUserId() {
    return this.userId;
  }

  getAccountId() {
    return this.accountId;
  }
}

export default LinkCreditCardDTO;
