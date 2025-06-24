class DomainException extends Error {
  constructor(message?: string) {
    super(message || 'DomainError');
    Error.captureStackTrace(this, DomainException);
    this.name = 'DomainException';
    this.message = message || 'DomainError';
  }
}

export default DomainException;
