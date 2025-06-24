class EscrowBankNotAttachedException extends Error {
  constructor() {
    super('no escrow account attached to campaign');
    Error.captureStackTrace(this, EscrowBankNotAttachedException);
    this.name = 'EscrowBankNotAttachedException';
  }
}

export default EscrowBankNotAttachedException;
