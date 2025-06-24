class ReEvaluatePreBankTransactionsDTO {
  private readonly uploadId: string;

  constructor(uploadId: string) {
    this.uploadId = uploadId;
  }

  getUploadId() {
    return this.uploadId;
  }
}

export default ReEvaluatePreBankTransactionsDTO;
