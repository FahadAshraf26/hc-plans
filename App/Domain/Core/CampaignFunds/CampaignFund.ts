import uuid from 'uuid/v4';
import Guard from '@infrastructure/Utils/Guard';
import DomainException from '../Exceptions/DomainException';
import InvestmentType from './InvestmentType';

class CampaignFund {
  campaignFundId: string;
  private _props: any;
  charge: any;
  campaign: any;
  investor: any;
  investorId;
  entityId: string;
  hybridTransactions: any;
  includeWallet: boolean;
  repeatInvestor?: string;
  promotionCredits?: number;

  constructor(campaignFundId, props) {
    this.campaignFundId = campaignFundId;
    this._props = props;
  }

  CampaignFundId() {
    return this.campaignFundId;
  }

  CampaignId() {
    return this._props.campaignId;
  }

  InvestorId() {
    return this._props.investorId;
  }

  InvestorPaymentOptionsId() {
    return this._props.investorPaymentOptionsId;
  }

  Amount() {
    return this._props.amount.getValue();
  }

  NetAmount() {
    return this._props.netAmount;
  }

  Ip() {
    return this._props.ip;
  }

  InvestmentType() {
    return this._props.investmentType.getValue();
  }

  InvestorStatusAtTimeOfInvestment() {
    return {
      investorAccreditationStatus: this._props.investorAccreditationStatus,
      investorAnnualIncome: this._props.investorAnnualIncome,
      investorNetWorth: this._props.investorNetWorth,
    };
  }

  setChargeId(chargeId) {
    this._props.chargeId = chargeId;
  }

  ChargeId() {
    return this._props.chargeId;
  }

  Charge() {
    return this.charge || undefined;
  }

  setCharge(charge) {
    this._props.chargeId = charge.chargeId;
    this.charge = charge;
  }

  MarkInvestmentTypeAsAccredited() {
    this._props.investmentType = InvestmentType.Accredited();
  }

  setCampaign(campaign) {
    this.campaign = campaign;
  }

  Campaign() {
    return this.campaign;
  }

  HybridTransaction() {
    return this.hybridTransactions;
  }

  IncludeWallet() {
    return this.includeWallet;
  }

  RepeatInvestor() {
    return this.repeatInvestor;
  }

  setTimestamps({ createdAt, updatedAt, deletedAt }) {
    this._props.createdAt = createdAt;
    this._props.updatedAt = updatedAt;
    this._props.deletedAt = deletedAt;
  }

  getTimestamps() {
    return {
      createdAt: this._props.createdAt,
      updatedAt: this._props.updatedAt,
      deletedAt: this._props.deletedAt,
    };
  }

  setPromotionCredits() {
    this._props.promotionCredits = 5;
  }

  CreatedAt() {
    return this._props.createdAt;
  }

  UpdatedAt() {
    return this._props.updatedAt;
  }

  DeletedAt() {
    return this._props.deletedAt;
  }

  isDeleted() {
    return !!this._props.deletedAt;
  }

  setInvestor(investor) {
    this.investor = investor;
  }

  setHybridTransaction(hybridTransaction) {
    this.hybridTransactions = hybridTransaction;
  }

  setIncludeWallet(includeWallet) {
    this.includeWallet = includeWallet;
  }

  setRepeatInvestor(repeatInvestor) {
    this.repeatInvestor = repeatInvestor;
  }

  setAmount(amount: number) {
    this._props.amount._value = amount;
  }

  setNetAmount(netAmount: number) {
    this._props.netAmount = netAmount;
  }

  Investor() {
    return this.investor;
  }

  EntityId() {
    return this._props.entityId;
  }

  PromotionCredits() {
    return this._props.promotionCredits;
  }

  static create(props?: any, campaignFundId?: string) {
    if (!campaignFundId) {
      campaignFundId = uuid();
    }

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.campaignId, argumentName: 'campaignId' },
      { argument: props.investorId, argumentName: 'investorId' },
      // { argument: props.investorPaymentOptionsId, argumentName: 'paymentOptionId' },
      { argument: props.amount, argumentName: 'amount' },
      // {argument: props.ip, argumentName: 'ip'},
      {
        argument: props.investorAccreditationStatus,
        argumentName: 'investorAccreditationStatus',
      },
      { argument: props.investorAnnualIncome, argumentName: 'investorAnnualIncome' },
      { argument: props.investorNetWorth, argumentName: 'investorNetWorth' },
      { argument: props.investmentType, argumentName: 'investmentType' },
      { argument: props.netAmount, argumentName: 'netAmount' },
    ]);

    if (!guardResult.succeeded) {
      throw new DomainException(guardResult.message);
    }

    return new CampaignFund(campaignFundId, props);
  }

  static createEntityFund(props?: any, campaignFundId?: string) {
    if (!campaignFundId) {
      campaignFundId = uuid();
    }

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.campaignId, argumentName: 'campaignId' },
      { argument: props.investorId, argumentName: 'investorId' },
      // { argument: props.investorPaymentOptionsId, argumentName: 'paymentOptionId' },
      { argument: props.amount, argumentName: 'amount' },
      // {argument: props.ip, argumentName: 'ip'},
      {
        argument: props.investorAccreditationStatus,
        argumentName: 'investorAccreditationStatus',
      },
      { argument: props.investorAnnualIncome, argumentName: 'investorAnnualIncome' },
      { argument: props.investorNetWorth, argumentName: 'investorNetWorth' },
      { argument: props.investmentType, argumentName: 'investmentType' },
      { argument: props.entityId, argumentName: 'entityId' },
      { argument: props.netAmount, argumentName: 'netAmount' },
    ]);

    if (!guardResult.succeeded) {
      throw new DomainException(guardResult.message);
    }

    return new CampaignFund(campaignFundId, props);
  }
}

export default CampaignFund;
