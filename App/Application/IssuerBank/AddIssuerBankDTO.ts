class AddIssuerAccountDTO {
  private publicToken: string;
  private accountId: string;
  private issuerId: string;
  private accountType: string;
  private accountOwner: string;

  constructor(publicToken, accountId, issuerId, accountType, accountOwner) {
    this.publicToken = publicToken;
    this.accountId = accountId;
    this.issuerId = issuerId;
    this.accountType = accountType;
    this.accountOwner = accountOwner;
  }

  getIssuerId() {
    return this.issuerId;
  }

  getPublicToken() {
    return this.publicToken;
  }

  getAccountId() {
    return this.accountId;
  }

  getAccountType() {
    return this.accountType;
  }

  getAccountOwner() {
    return this.accountOwner;
  }
}

export default AddIssuerAccountDTO;
