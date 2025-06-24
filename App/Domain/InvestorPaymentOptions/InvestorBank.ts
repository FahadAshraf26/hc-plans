import uuid from 'uuid/v4';
import Guard from '@infrastructure/Utils/Guard';
import DomainException from '../Core/Exceptions/DomainException';

type propsType = {
  investorPaymentOptionsId?: string;
  accountType: any;
  accountNumber: string;
  routingNumber: string;
  wireRoutingNumber?: string;
  bankName: string;
  accountName: string;
  bankToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  dwollaFundingSourceId?: string;
};

class InvestorBank {
  private investorBankId: string;
  private _props: propsType;

  constructor(investorBankId, props) {
    this.investorBankId = investorBankId;
    this._props = props;
  }

  getInvestorBankId(): string {
    return this.investorBankId;
  }

  getParentId(): string | undefined {
    return this._props.investorPaymentOptionsId;
  }

  setParentId(parentId: string) {
    this._props.investorPaymentOptionsId = parentId;
  }

  getAccountType(): string {
    return this._props.accountType.getValue();
  }

  getAccountNumber(): string {
    return this._props.accountNumber;
  }

  getLastFour(): string {
    return this._props.accountNumber.substr(this._props.accountNumber.length - 4, 4);
  }

  getRoutingNumber(): string {
    return this._props.routingNumber;
  }

  getWireRoutingNumber(): string | undefined {
    return this._props.wireRoutingNumber;
  }

  getBankName(): string {
    return this._props.bankName;
  }

  getAccountName(): string {
    return this._props.accountName;
  }

  getToken(): string | undefined {
    return this._props.bankToken;
  }

  setToken(token: string) {
    this._props.bankToken = token;
  }

  getCreatedAt(): Date {
    return this._props.createdAt;
  }

  getUpdatedAt(): Date {
    return this._props.updatedAt;
  }

  getDeletedAt(): Date | null {
    return this._props.deletedAt;
  }

  getDwollaFundingSourceId() {
    return this._props.dwollaFundingSourceId;
  }

  setDwollaFundingSourceId(dwollaFundingSourceId: string) {
    this._props.dwollaFundingSourceId = dwollaFundingSourceId;
  }

  static create(props: propsType, investorBankId?: string) {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.accountType, argumentName: 'accountType' },
      { argument: props.accountName, argumentName: 'accountName' },
      { argument: props.accountNumber, argumentName: 'accountNumber' },
      { argument: props.routingNumber, argumentName: 'routingNumber' },
      { argument: props.bankName, argumentName: 'bankName' },
    ]);

    if (!guardResult.succeeded) {
      throw new DomainException(guardResult.message);
    }

    if (!investorBankId) {
      investorBankId = uuid();
    }

    return new InvestorBank(investorBankId, props);
  }
}

export default InvestorBank;
