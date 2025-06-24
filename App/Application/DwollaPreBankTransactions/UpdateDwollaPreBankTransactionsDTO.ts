import DwollaPreBankTransactions from '@domain/Core/DwollaPreBankTransactions/DwollaPreBankTransactions';

class UpdateDwollaPreBankTransactionsDTO {
  private dwollaPreBankTransactionId: string;
  private payload: any;

  constructor(dwollaPreTransactionId: string, payload) {
    this.dwollaPreBankTransactionId = dwollaPreTransactionId;
    this.payload = DwollaPreBankTransactions.createFromObject(payload);
  }

  getDwollaPreBankTransactionId(): string {
    return this.dwollaPreBankTransactionId;
  }

  getPayload() {
    return this.payload;
  }
}

export default UpdateDwollaPreBankTransactionsDTO;
