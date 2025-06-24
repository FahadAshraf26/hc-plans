class InvestorIncomeDetailsNotSubmittedException extends Error {
  constructor(message?: string) {
    super(message);
    Error.captureStackTrace(this, InvestorIncomeDetailsNotSubmittedException);
    this.name = 'InvestorIncomeDetailsNotSubmittedException';
  }
}

export default InvestorIncomeDetailsNotSubmittedException;
