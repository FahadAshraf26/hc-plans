import DomainException from '../../Core/Exceptions/DomainException';

class InvestmentLimitReachedException extends DomainException {
  constructor() {
    super('you cannot invest in this campaign. investment limit reached');
    Error.captureStackTrace(this, InvestmentLimitReachedException);
    this.name = 'InvestmentLimitReachedException';
  }
}

export default InvestmentLimitReachedException;
