import uuid from 'uuid/v4';
import Guard from '../../../Infrastructure/Utils/Guard';
import DomainException from '../Exceptions/DomainException';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class InvestorPayment extends BaseEntity {
  private investorPaymentsId: string;
  private prorate: number;
  private campaignId: string;
  private investorId: string;
  private entityId: string;

  constructor({
    investorPaymentsId,
    prorate,
    campaignId,
    investorId,
    entityId,
    createdAt,
  }) {
    super();
    this.investorPaymentsId = investorPaymentsId;
    this.prorate = prorate;
    this.campaignId = campaignId;
    this.investorId = investorId;
    this.entityId = entityId;
    this.createdAt = createdAt;
  }

  /**
   * Create InvestorPayment Object
   * @param {object} investorPaymentObj
   * @returns investorPayment
   */
  static createFromObject(investorPaymentObj) {
    const investorPayment = new InvestorPayment(investorPaymentObj);

    return investorPayment;
  }

  toPublicDTO() {
    return this;
  }

  static createFromDetail({ prorate, campaignId, investorId, entityId, createdAt }) {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: prorate, argumentName: 'prorate' },
      { argument: campaignId, argumentName: 'campaignId' },
      { argument: investorId, argumentName: 'investorId' },
    ]);

    if (!guardResult.succeeded) {
      throw new DomainException(guardResult.message);
    }

    return new InvestorPayment({
      investorPaymentsId: uuid(),
      prorate,
      campaignId,
      investorId,
      entityId,
      createdAt,
    });
  }

  getInvestorPaymentsId() {
    return this.investorPaymentsId;
  }
}

export default InvestorPayment;
