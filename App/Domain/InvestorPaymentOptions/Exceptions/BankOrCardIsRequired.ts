import DomainException from '../../Core/Exceptions/DomainException';

class BankOrCardIsRequired extends DomainException {
  constructor() {
    super();
    Error.captureStackTrace(this, BankOrCardIsRequired);
    this.name = 'BankOrCardIsRequired';
    this.message = 'One of Bank or Card is required';
  }
}

export default BankOrCardIsRequired;
