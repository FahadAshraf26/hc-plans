class FindIssuerDocumentDTO {
  private issuerDocumentId: string;

  constructor(issuerDocumentId: string) {
    this.issuerDocumentId = issuerDocumentId;
  }

  getIssuerDocumentId() {
    return this.issuerDocumentId;
  }
}

export default FindIssuerDocumentDTO;
