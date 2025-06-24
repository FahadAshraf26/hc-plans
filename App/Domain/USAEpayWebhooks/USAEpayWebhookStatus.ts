import InvalidWebhookStatusException from './Exceptions/InvalidUSAEpayWebhookStatusException';

class USAEpayWebhookStatus {
  private readonly _value: string;

  static webhookStatus = {
    success: 'SUCCESS',
    pending: 'PENDING',
    failed: 'FAILED',
  };

  constructor(value) {
    this._value = value;
  }

  value() {
    return this._value;
  }

  static isValidWebhookType(value) {
    return Object.values(this.webhookStatus).includes(value);
  }

  static createFromValue(value) {
    if (!this.isValidWebhookType(value)) {
      throw new InvalidWebhookStatusException();
    }

    return new USAEpayWebhookStatus(value);
  }

  static Success() {
    return USAEpayWebhookStatus.createFromValue(
      USAEpayWebhookStatus.webhookStatus.success,
    );
  }

  static Pending() {
    return USAEpayWebhookStatus.createFromValue(
      USAEpayWebhookStatus.webhookStatus.pending,
    );
  }

  static Failed() {
    return USAEpayWebhookStatus.createFromValue(
      USAEpayWebhookStatus.webhookStatus.failed,
    );
  }
}

export default USAEpayWebhookStatus;
