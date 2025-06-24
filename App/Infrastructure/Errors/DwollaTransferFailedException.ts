class DwollaTransferFailedException extends Error {
  private data: any;

  constructor(data: any) {
    super();
    Error.captureStackTrace(this, DwollaTransferFailedException);
    this.name = 'DwollaTransferFailedException';
    this.data = data;
  }
}

export default DwollaTransferFailedException;
