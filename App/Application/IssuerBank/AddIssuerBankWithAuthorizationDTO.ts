class AddIssuerBankWithAuthorizationDTO {
  private issuerId: string;
  private accountNumber: string;
  private accountName: string;
  private routingNumber: string;
  private accountType: string;
  private accountOwner: string;
  constructor(
    issuerId: string,
    accountNumber: string,
    accountName: string,
    routingNumber: string,
    accountType: string,
    accountOwner: string,
  ) {
    this.issuerId = issuerId;
    this.accountNumber = accountNumber;
    this.accountName = accountName;
    this.routingNumber = routingNumber;
    this.accountType = accountType;
    this.accountOwner = accountOwner;
  }

  getIssuerId() {
    return this.issuerId;
  }

  getAccountNumber() {
    return this.accountNumber;
  }

  getAccountName() {
    return this.accountName;
  }

  getRoutingNumber() {
    return this.routingNumber;
  }

  getAccountType() {
    return this.accountType;
  }

  getAccountOwner() {
    return this.accountOwner;
  }
}

export default AddIssuerBankWithAuthorizationDTO;
