import InvalidIssueTypeException from './Exceptions/InvalidIssueTypeException';

class IssueType {
  _value: string;

  static issueTypes = {
    businessUpdate: 'Business Update',
    campaignQuestions: 'Campaign Forum',
    investment: 'Investments',
  };

  constructor(value: string) {
    this._value = value;
  }

  static isValidIssueType(value) {
    return Object.values(this.issueTypes).includes(value);
  }

  static createFromValue(value) {
    if (!this.isValidIssueType(value)) {
      throw new InvalidIssueTypeException();
    }

    return new IssueType(value);
  }

  value() {
    return this._value;
  }
}

export default IssueType;
