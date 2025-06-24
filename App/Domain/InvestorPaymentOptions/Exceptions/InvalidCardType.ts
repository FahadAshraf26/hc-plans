import DomainException from '../../Core/Exceptions/DomainException';

class InvalidCardType extends DomainException {
  constructor() {
    super();
    Error.captureStackTrace(this, InvalidCardType);
    this.name = 'InvalidCardType';
    this.message = 'Invalid Card Type';
  }
}

export default InvalidCardType;
