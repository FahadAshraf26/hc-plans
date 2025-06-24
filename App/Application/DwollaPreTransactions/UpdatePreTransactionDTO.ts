import DwollaPreTransactions from '@domain/Core/DwollaPreTransactions/DwollaPreTransactions';

class UpdatePreTransactionDTO {
  private dwollaPreTransactionId: string;
  private payload: any;

  constructor(dwollaPreTransactionId: string, payload) {
    this.dwollaPreTransactionId = dwollaPreTransactionId;
    this.payload = DwollaPreTransactions.createFromObject(payload);
  }

  getDwollaPreTransactionId(): string {
    return this.dwollaPreTransactionId;
  }

  getPayload() {
    return this.payload;
  }
}

export default UpdatePreTransactionDTO;
