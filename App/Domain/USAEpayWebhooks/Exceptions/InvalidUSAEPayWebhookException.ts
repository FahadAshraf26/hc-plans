import DomainException from '../../Core/Exceptions/DomainException';

class InvalidUSAEPayWebhookException extends DomainException {
  constructor() {
    super();
    Error.captureStackTrace(this, InvalidUSAEPayWebhookException);
    this.name = 'InvalidUSAEPayWebhookException';
    this.message = 'Invalid USAEPay Webhook Status';
  }
}

export default InvalidUSAEPayWebhookException;
