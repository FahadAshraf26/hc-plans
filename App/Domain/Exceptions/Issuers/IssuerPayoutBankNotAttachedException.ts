class IssuerPayoutBankNotAttachedException extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this, IssuerPayoutBankNotAttachedException);
    this.name = 'IssuerPayoutBankNotAttachedException';
    this.message = message || this.name;
  }
}

export default IssuerPayoutBankNotAttachedException;
