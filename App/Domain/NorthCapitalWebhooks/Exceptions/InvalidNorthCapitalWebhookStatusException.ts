import DomainException from '../../Core/Exceptions/DomainException';

class InvalidNorthCapitalWebhookStatusException extends DomainException {
  constructor() {
    super();
    Error.captureStackTrace(this, InvalidNorthCapitalWebhookStatusException);
    this.name = 'InvalidNorthCapitalWebhookStatusException';
    this.message = 'Invalid North Capital Webhook Status';
  }
}

export default InvalidNorthCapitalWebhookStatusException;
