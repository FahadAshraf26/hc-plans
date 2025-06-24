class RemoveIssuerDocumentDTO {
  private issuerDocumentId: string;
  private hardDelete: boolean;
  constructor(issuerDocumentId, hardDelete = false) {
    this.issuerDocumentId = issuerDocumentId;
    this.hardDelete = hardDelete;
  }

  getIssuerDocumentId() {
    return this.issuerDocumentId;
  }

  shouldHardDelete() {
    return this.hardDelete === true;
  }
}

export default RemoveIssuerDocumentDTO;
