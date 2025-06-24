class TransferFundsToCustodyUseCaseDTO {
  private uploadId: string;

  constructor(uploadId: string) {
    this.uploadId = uploadId;
  }

  getUploadId() {
    return this.uploadId;
  }
}

export default TransferFundsToCustodyUseCaseDTO;
