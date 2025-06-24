class ReUploadFailedTransfer {
  private dwollaCustodyTransactionId: string;

  constructor(dwollaCustodyTransactionId: string) {
    this.dwollaCustodyTransactionId = dwollaCustodyTransactionId;
  }

  getDwollaCustodyTransactionId() {
    return this.dwollaCustodyTransactionId;
  }
}

export default ReUploadFailedTransfer;
