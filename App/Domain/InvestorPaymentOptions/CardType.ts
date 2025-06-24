import InvalidCardType from './Exceptions/InvalidCardType';

class CardType {
  static cardTypes = {
    visa: 'visa',
    discover: 'discover',
    masterCard: 'mastercard',
    americanExpress: 'amex',
    dinersClub: 'diners',
    JCB: 'jcb',
    UnionPay: 'unionpay',
  };
  private readonly value: string;

  constructor(value) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }

  static isValidCardType(value) {
    return Object.values(this.cardTypes).includes(value.toLowerCase());
  }

  static createFromValue(value) {
    if (value) {
      if (!this.isValidCardType(value)) {
        throw new InvalidCardType();
      }
    }

    return new CardType(value);
  }
}

export default CardType;
