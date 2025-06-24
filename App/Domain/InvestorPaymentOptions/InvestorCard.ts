import uuid from 'uuid/v1';
import Guard from '../../Infrastructure/Utils/Guard';
import DomainException from '../Core/Exceptions/DomainException';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

type propsType = {
  investorPaymentOptionsId?: string;
  creditCardName: string;
  cardType: any;
  lastFour: string;
  isStripeCard: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

class InvestorCard extends BaseEntity {
  private investorCardId?: string;
  private _props: propsType;

  constructor(props: propsType, investorCardId?: string) {
    super();
    this.investorCardId = investorCardId;
    this._props = props;
  }

  getInvestorCardId(): string | undefined {
    return this.investorCardId;
  }

  getParentId(): string | undefined {
    return this._props.investorPaymentOptionsId;
  }

  setParentId(parentId: string) {
    this._props.investorPaymentOptionsId = parentId;
  }

  getCardType(): string {
    return this._props.cardType;
  }

  getCardName(): string {
    return this._props.creditCardName;
  }

  getLastFour(): string {
    return this._props.lastFour;
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

  getIsStripeCard() {
    return this._props.isStripeCard
  }

  static create(props: propsType, investorCardId?: string) {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.creditCardName, argumentName: 'credit card name' },
      { argument: props.cardType, argumentName: 'cardType' },
      { argument: props.lastFour, argumentName: 'lastFour' },
    ]);

    if (!guardResult.succeeded) {
      throw new DomainException(guardResult.message);
    }

    if (!investorCardId) {
      investorCardId = uuid();
    }

    return new InvestorCard(props, investorCardId);
  }
}

export default InvestorCard;
