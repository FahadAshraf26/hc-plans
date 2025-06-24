import DomainException from '../../Core/Exceptions/DomainException';

class InvalidPaymentOption extends DomainException {
  constructor() {
    super();
    Error.captureStackTrace(this, InvalidPaymentOption);
    this.name = 'InvalidPaymentOption';
    this.message = 'Invalid Payment Option Type';
  }
}

export default InvalidPaymentOption;
