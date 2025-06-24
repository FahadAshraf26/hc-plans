import InvestmentAmount from '@domain/Core/CampaignFunds/InvestmentAmount';

type fundsType = {
  campaignId: string;
  userId: string;
  investorId: string;
  amount: number;
  ip: string;
  entityId?: string;
  isMobilePlatform?: boolean;
  transferId: string;
  referenceNumber: string;
  transactionType: string;
  isRaiseGreenDay?: boolean;
};

class UpdateEPayTransactionDTO {
  private readonly campaignId: string;
  private readonly userId: string;
  private readonly investorId: string;
  private readonly amount: number;
  private readonly ip: string;
  private readonly entityId?: string;
  private readonly isMobilePlatform?: boolean;
  private readonly transferId: string;
  private readonly referenceNumber: string;
  private readonly transactionType: string;
  private readonly isRaiseGreenDay?: boolean;
  private readonly promotionAmount: number = 5;
  numberOfPromotionCreditsInvestments: number;

  constructor({
    campaignId,
    userId,
    investorId,
    amount,
    ip,
    entityId = null,
    isMobilePlatform = null,
    transferId,
    referenceNumber,
    transactionType,
    isRaiseGreenDay,
  }: fundsType) {
    this.campaignId = campaignId;
    this.userId = userId;
    this.investorId = investorId;
    this.amount = amount;
    this.ip = ip;
    this.entityId = entityId;
    this.isMobilePlatform = isMobilePlatform;
    this.transferId = transferId;
    this.referenceNumber = referenceNumber;
    this.transactionType = transactionType;
    this.isRaiseGreenDay = isRaiseGreenDay;
  }

  CampaignId() {
    return this.campaignId;
  }

  UserId() {
    return this.userId;
  }

  InvestorId() {
    return this.investorId;
  }

  Amount() {
    return this.amount;
  }

  TransactionType() {
    return this.transactionType;
  }

  Ip() {
    return this.ip;
  }

  EntityId() {
    return this.entityId;
  }

  IsMobilePlatform() {
    return this.isMobilePlatform;
  }

  TransferId() {
    return this.transferId;
  }

  ReferenceId() {
    return this.referenceNumber;
  }

  NumberOfPromotionCreditsInvestments() {
    return this.numberOfPromotionCreditsInvestments;
  }

  IsRaiseGreenDay() {
    return this.isRaiseGreenDay;
  }

  PromotionAmount() {
    return this.promotionAmount;
  }

  setNumberOfPromotionCreditsInvestments(numberOfPromotionCreditsInvestments: number) {
    this.numberOfPromotionCreditsInvestments = numberOfPromotionCreditsInvestments;
  }

  canAvailPromotionCredits() {
    return this.isRaiseGreenDay && this.numberOfPromotionCreditsInvestments === 0;
  }
}

export default UpdateEPayTransactionDTO;
