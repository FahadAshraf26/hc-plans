import DomainException from '../Exceptions/DomainException';

class TransactionType {
  private readonly _value: any;

  static transactionTypes = {
    ach: 'ACH',
    creditCard: 'CREDITCARD',
    hybrid: 'HYBRID',
    wallet:'WALLET',
    applePay: 'APPLEPAY',
    googlePay: 'GOOGLEPAY'
  };

  constructor(value) {
    this._value = value;
  }

  getValue() {
    return this._value;
  }

  static isValidTransactionType(value) {
    return Object.values(this.transactionTypes).includes(value);
  }

  static createFromValue(value) {
    if (!this.isValidTransactionType(value)) {
      throw new DomainException('invalid transaction type');
    }

    return new TransactionType(value);
  }

  static ACH() {
    return TransactionType.createFromValue(TransactionType.transactionTypes.ach);
  }

  static CreditCard() {
    return TransactionType.createFromValue(TransactionType.transactionTypes.creditCard);
  }

  static Hybrid() {
    return TransactionType.createFromValue(TransactionType.transactionTypes.hybrid);
  }

  static Wallet() {
    return TransactionType.createFromValue(TransactionType.transactionTypes.wallet);
  }

  static GooglePay(){
    return TransactionType.createFromValue(TransactionType.transactionTypes.googlePay);
  }

  static ApplePay(){
    return TransactionType.createFromValue(TransactionType.transactionTypes.applePay);
  }
}

export default TransactionType;
