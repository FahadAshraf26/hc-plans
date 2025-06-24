import DomainException from '../../Exceptions/DomainException';

class InvalidInvestmentAmountException extends DomainException {
  constructor() {
    super('Invalid investment amount');
    Error.captureStackTrace(this, InvalidInvestmentAmountException);
    this.name = 'InvalidInvestmentAmountException';
  }
}

export default InvalidInvestmentAmountException;
