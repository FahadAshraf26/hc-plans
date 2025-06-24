class FetchByTransferIdDTO {
  private dwollaTransferId: string;
  constructor(dwollaTransferId: string) {
    this.dwollaTransferId = dwollaTransferId;
  }

  getDwollaTransferId() {
    return this.dwollaTransferId;
  }
}

export default FetchByTransferIdDTO;
