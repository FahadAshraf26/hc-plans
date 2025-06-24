import DomainException from '../../Core/Exceptions/DomainException';

class NoNorthCapitalAccount extends DomainException {
  constructor() {
    super();
    Error.captureStackTrace(this, NoNorthCapitalAccount);
    this.name = 'NoNorthCapitalAccount';
    this.message = 'User not registered with North Capital.';
  }
}

export default NoNorthCapitalAccount;
