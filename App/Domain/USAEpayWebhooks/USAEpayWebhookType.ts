import InvalidWebhookTypeException from './Exceptions/InvalidUSAEPayWebhookException';

class USAEPayWebhookType {
  private readonly _value: string;

  static webhookType = {
    TransactionSaleSuccess: 'transaction.sale.success',
    TransactionSaleFailure: 'transaction.sale.failure',
    TransactionSaleVoid: 'transaction.sale.voided',
    AchSettled: 'ach.settled',
    AchFailed: 'ach.failed',
    AchVoided: 'ach.voided',
  };

  constructor(value) {
    this._value = value;
  }

  static isValidWebhookType(value) {
    return Object.values(this.webhookType).includes(value);
  }

  static createFromValue(value) {
    if (!this.isValidWebhookType(value)) {
      throw new InvalidWebhookTypeException();
    }

    return new USAEPayWebhookType(value);
  }

  value() {
    return this._value;
  }

  static TransactionSaleSuccess() {
    return USAEPayWebhookType.createFromValue(
      USAEPayWebhookType.webhookType.TransactionSaleSuccess,
    );
  }

  static TransactionSaleFailure() {
    return USAEPayWebhookType.createFromValue(
      USAEPayWebhookType.webhookType.TransactionSaleFailure,
    );
  }

  static TransactionSaleVoid() {
    return USAEPayWebhookType.createFromValue(
      USAEPayWebhookType.webhookType.TransactionSaleVoid,
    );
  }

  static AchSettled() {
    return USAEPayWebhookType.createFromValue(USAEPayWebhookType.webhookType.AchSettled);
  }

  static AchFailed() {
    return USAEPayWebhookType.createFromValue(USAEPayWebhookType.webhookType.AchFailed);
  }
  static AchVoided() {
    return USAEPayWebhookType.createFromValue(USAEPayWebhookType.webhookType.AchVoided);
  }
}

export default USAEPayWebhookType;
