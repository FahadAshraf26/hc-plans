class InvestmentType {
  private readonly _value: any;

  static investmentTypes = {
    regCF: 'Reg CF',
    regD: 'Reg D',
  };

  constructor(value) {
    this._value = value;
  }

  getValue() {
    return this._value;
  }

  static isValidInvestmentType(value) {
    return Object.values(this.investmentTypes).includes(value);
  }

  static createFromValue(value) {
    if (value && !this.isValidInvestmentType(value)) {
    }

    if (!value) {
      value = this.investmentTypes.regCF;
    }

    return new InvestmentType(value);
  }

  static Accredited() {
    return InvestmentType.createFromValue(InvestmentType.investmentTypes.regD);
  }

  static NonAccredited() {
    return InvestmentType.createFromValue(InvestmentType.investmentTypes.regCF);
  }
}

export default InvestmentType;
