import uuid from 'uuid/v1';
import DomainException from '../Core/Exceptions/DomainException';
import Guard from '../../Infrastructure/Utils/Guard';
import BankOrCardIsRequired from './Exceptions/BankOrCardIsRequired';
import InvestorCard from './InvestorCard';
import InvestorBank from './InvestorBank';
import PaymentOptionType from './PaymentOptionType';

class InvestorPaymentOptions {
  private investorPaymentOptionsId?: string;
  private createdAt: Date;
  private _props: {
    investorId: string;
    type: PaymentOptionType;
    bank: InvestorBank;
    card: InvestorCard;
  };
  constructor(props, investorPaymentOptionsId?: string, createdAt?:Date) {
    this.investorPaymentOptionsId = investorPaymentOptionsId;
    this._props = props;
    this.createdAt = createdAt;
  }

  getInvestorPaymentOptionsId(): string | undefined {
    return this.investorPaymentOptionsId;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getInvestorId(): string {
    return this._props.investorId;
  }

  getType(): string {
    return this._props.type.getValue();
  }

  getBank() {
    return this._props.bank;
  }

  getCard() {
    return this._props.card;
  }

  Name(): string {
    return this.isBank() ? this.getBank().getAccountName() : this.getCard().getCardName();
  }

  isBank(): boolean {
    return !!this._props.bank && !!this._props.card === false;
  }

  isCard(): boolean {
    return !!this._props.card && !!this._props.bank === false;
  }

  static create(props, investorPaymentOptionsId?: string,createdAt?:Date) {
    const hasBankResult = Guard.againstNullOrUndefined(props.bank, 'bank');
    const hasCardResult = Guard.againstNullOrUndefined(props.card, 'card');

    if (!hasBankResult.succeeded && !hasCardResult.succeeded) {
      throw new BankOrCardIsRequired();
    }

    if (hasBankResult.succeeded && hasCardResult.succeeded) {
      throw new BankOrCardIsRequired();
    }

    const guardResult = Guard.againstNullOrUndefinedBulk([
      {
        argument: props.type,
        argumentName: 'Payment Option type',
      },
      { argument: props.investorId, argumentName: 'investorId' },
    ]);

    if (!guardResult.succeeded) {
      throw new DomainException(guardResult.message);
    }

    if (!investorPaymentOptionsId) {
      investorPaymentOptionsId = uuid();
    }

    if (props.card) {
      props.card.setParentId(investorPaymentOptionsId);
    }

    if (props.bank) {
      props.bank.setParentId(investorPaymentOptionsId);
    }

    return new InvestorPaymentOptions(props, investorPaymentOptionsId,createdAt);
  }
}

export default InvestorPaymentOptions;
