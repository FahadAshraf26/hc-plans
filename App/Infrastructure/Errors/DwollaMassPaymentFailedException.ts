class DwollaMassPaymentFailedException extends Error {
  private data: any;

  constructor(data: any) {
    super();
    Error.captureStackTrace(this, DwollaMassPaymentFailedException);
    this.name = 'DwollaMassPaymentFailedException';
    this.data = data;
  }
}

export default DwollaMassPaymentFailedException;
