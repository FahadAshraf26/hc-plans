import DomainException from '../../Core/Exceptions/DomainException';

class InvestorBankNotFoundException extends DomainException {
  constructor() {
    super('Investor bank not found!');
    Error.captureStackTrace(this, InvestorBankNotFoundException);
    this.name = 'InvestorBankNotFoundException';
  }
}

export default InvestorBankNotFoundException;
