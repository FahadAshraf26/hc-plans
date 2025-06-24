import DomainException from '../../Core/Exceptions/DomainException';

class InvalidUSAEpayWebhookStatusException extends DomainException {
  constructor() {
    super();
    Error.captureStackTrace(this, InvalidUSAEpayWebhookStatusException);
    this.name = 'InvalidUSAEPayWebhookStatusException';
    this.message = 'Invalid USAEpay Webhook Status';
  }
}

export default InvalidUSAEpayWebhookStatusException;
