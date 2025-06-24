class GetDwollaBusinessClassificationWithIssuerDTO {
  private issuerOwnerId: string;
  private issuerId: string;
  constructor(issuerOwnerId: string, issuerId: string) {
    this.issuerOwnerId = issuerOwnerId;
    this.issuerId = issuerId;
  }

  getIssuerOwnerId() {
    return this.issuerOwnerId;
  }

  getIssuerId() {
    return this.issuerId;
  }
}

export default GetDwollaBusinessClassificationWithIssuerDTO;
