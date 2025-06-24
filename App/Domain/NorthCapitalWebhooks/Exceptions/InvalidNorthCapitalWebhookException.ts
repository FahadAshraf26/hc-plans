import DomainException from '../../Core/Exceptions/DomainException';

class InvalidNorthCapitalWebhookException extends DomainException {
  constructor() {
    super();
    Error.captureStackTrace(this, InvalidNorthCapitalWebhookException);
    this.name = 'InvalidNorthCapitalWebhookException';
    this.message = 'Invalid North Capital Webhook Status';
  }
}

export default InvalidNorthCapitalWebhookException;
