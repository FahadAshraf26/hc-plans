import DomainException from '../../Core/Exceptions/DomainException';

class InvalidBankType extends DomainException {
  constructor() {
    super();
    Error.captureStackTrace(this, InvalidBankType);
    this.name = 'InvalidBankType';
    this.message = 'Invalid Bank Type';
  }
}

export default InvalidBankType;
