import InvalidInvestmentAmountException from './Exceptions/InvalidInvestmentAmountException';

class InvestmentAmount {
  _value: string | number;
  private minInvestmentAmount: number;

  constructor(value: string | number, minAmount: number) {
    this._value = value;
    this.minInvestmentAmount = minAmount;
  }

  getValue() {
    return this._value;
  }

  static isValidNumber(value, minAmount) {
    return (
      !isNaN(value) &&
      (Number.isInteger(value) || (Number(value) === value && value % 1 !== 0)) &&
      value >= minAmount
    );
  }

  static createFormValue(value, minAmount) {
    value = parseFloat(value);

    if (!this.isValidNumber(value, minAmount)) {
      throw new InvalidInvestmentAmountException();
    }

    return new InvestmentAmount(value, minAmount);
  }
}

export default InvestmentAmount;
