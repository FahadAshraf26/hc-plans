class DeleteIssuerDTO {
  private issuerId: string;
  private hardDelete: string;

  constructor(issuerId: string, hardDelete: string) {
    this.issuerId = issuerId;
    this.hardDelete = hardDelete;
  }

  getIssuerId() {
    return this.issuerId;
  }

  shouldHardDelete() {
    return this.hardDelete === 'true';
  }
}

export default DeleteIssuerDTO;
