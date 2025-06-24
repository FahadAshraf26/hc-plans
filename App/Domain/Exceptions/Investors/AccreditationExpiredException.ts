class AccreditationExpiredException extends Error {
  constructor() {
    super('Your accredited investor status has expired. Check your email to re-certify');
    Error.captureStackTrace(this, AccreditationExpiredException);
    this.name = 'AccreditationExpiredException';
  }
}

export default AccreditationExpiredException;
