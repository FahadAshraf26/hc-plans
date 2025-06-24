class CreateTransferToWalletDTO {
  private issuerId: string;

  constructor(issuerId: string) {
    this.issuerId = issuerId;
  }

  getIssuerId() {
    return this.issuerId;
  }
}

export default CreateTransferToWalletDTO;
