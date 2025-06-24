import InvalidBankType from './Exceptions/InvalidBankType';

class BankType {
  static bankAccountTypes = {
    checking: 'checking',
    savings: 'savings',
  };
  private _value: any;

  constructor(value) {
    this._value = value;
  }

  getValue() {
    return this._value;
  }

  static isValidBankAccountType(value) {
    return Object.values(this.bankAccountTypes).includes(value);
  }

  static createFromValue(value) {
    // if (!this.isValidBankAccountType(value)) {
    //     throw new InvalidBankType();
    // }

    return new BankType(value);
  }
}

export default BankType;
