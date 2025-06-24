class PossibleDuplicateInvestmentException extends Error {
  constructor() {
    super('Try again in 30 seconds!');
    Error.captureStackTrace(this, PossibleDuplicateInvestmentException);
    this.name = 'PossibleDuplicateInvestmentException';
  }
}

export default PossibleDuplicateInvestmentException;
