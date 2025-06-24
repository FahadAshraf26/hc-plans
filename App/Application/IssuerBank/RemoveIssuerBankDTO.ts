class removeIssuerBankDTO {
  private issuerId: string;
  private issuerBankId: string;

  constructor(issuerId, issuerBankId) {
    this.issuerId = issuerId;
    this.issuerBankId = issuerBankId;
  }

  getIssuerId() {
    return this.issuerId;
  }

  getIssuerBankId() {
    return this.issuerBankId;
  }
}

export default removeIssuerBankDTO;
