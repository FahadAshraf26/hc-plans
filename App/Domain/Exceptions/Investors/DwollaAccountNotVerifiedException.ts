class DwollaAccountNotVerifiedException extends Error {
  constructor() {
    super('Dwolla account not verified!');
    Error.captureStackTrace(this, DwollaAccountNotVerifiedException);
    this.name = 'DwollaAccountNotVerifiedException';
  }
}

export default DwollaAccountNotVerifiedException;
