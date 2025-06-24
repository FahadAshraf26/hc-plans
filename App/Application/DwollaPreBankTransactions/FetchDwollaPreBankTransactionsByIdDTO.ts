class FetchDwollaPreBankPreTransactionsByIdDTO {
  private readonly dwollaPreBankTransactionId: string;

  constructor(dwollaPreBankTransactionId: string) {
    this.dwollaPreBankTransactionId = dwollaPreBankTransactionId;
  }

  getDwollaPreBankTransactionId(): string {
    return this.dwollaPreBankTransactionId;
  }
}
export default FetchDwollaPreBankPreTransactionsByIdDTO;
