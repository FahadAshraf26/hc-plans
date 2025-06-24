class FetchPreTransactionsByIdDTO {
  private dwollaPreTransactionId: string;

  constructor(dwollaPreTransactionId: string) {
    this.dwollaPreTransactionId = dwollaPreTransactionId;
  }

  getDwollaPreTransactionId() {
    return this.dwollaPreTransactionId;
  }
}

export default FetchPreTransactionsByIdDTO;
