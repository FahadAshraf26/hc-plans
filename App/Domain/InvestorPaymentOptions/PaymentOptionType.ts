import InvalidPaymentOption from './Exceptions/InvalidPaymentOption';

class PaymentOptionType {
  static paymentOptionTypes = {
    card: 'Card',
    bank: 'Bank',
  };
  private _value: any;

  constructor(value) {
    this._value = value;
  }

  getValue() {
    return this._value;
  }

  static isValidPaymentOption(value) {
    return Object.values(this.paymentOptionTypes).includes(value);
  }

  static createFromValue(value) {
    if (!this.isValidPaymentOption(value)) {
      throw new InvalidPaymentOption();
    }

    return new PaymentOptionType(value);
  }

  static Card() {
    return PaymentOptionType.createFromValue(PaymentOptionType.paymentOptionTypes.card);
  }

  static Bank() {
    return PaymentOptionType.createFromValue(PaymentOptionType.paymentOptionTypes.bank);
  }
}

export default PaymentOptionType;
