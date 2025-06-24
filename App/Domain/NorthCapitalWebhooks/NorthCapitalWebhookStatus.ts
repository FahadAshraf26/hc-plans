import InvalidWebhookStatusException from './Exceptions/InvalidNorthCapitalWebhookException';

class NorthCapitalWebhookStatus {
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

    return new NorthCapitalWebhookStatus(value);
  }

  static Success() {
    return NorthCapitalWebhookStatus.createFromValue(
      NorthCapitalWebhookStatus.webhookStatus.success,
    );
  }

  static Pending() {
    return NorthCapitalWebhookStatus.createFromValue(
      NorthCapitalWebhookStatus.webhookStatus.pending,
    );
  }

  static Failed() {
    return NorthCapitalWebhookStatus.createFromValue(
      NorthCapitalWebhookStatus.webhookStatus.failed,
    );
  }
}

export default NorthCapitalWebhookStatus;
