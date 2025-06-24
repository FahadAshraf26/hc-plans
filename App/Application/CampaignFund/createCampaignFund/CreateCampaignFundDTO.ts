import InvestmentAmount from '@domain/Core/CampaignFunds/InvestmentAmount';
type fundsType = {
  campaignId: string;
  amount: number;
  userId: string;
  investorId: string;
  ip: string;
  entityId?: string;
  transactionType: string;
  isMobilePlatform?: boolean;
  isRaiseGreenDay?: boolean;
};
class CreateCampaignFundDTO {
  private readonly campaignId: string;
  private readonly amount: number;
  private readonly userId: string;
  private readonly ip: string;
  private readonly investorId: string;
  private readonly entityId?: string;
  private readonly transactionType: string;
  private readonly isMobilePlatform?: boolean;
  private readonly isRaiseGreenDay?: boolean;
  private readonly promotionAmount: number = 5;
  numberOfPromotionCreditsInvestments: number;

  constructor({
    campaignId,
    amount,
    userId,
    investorId,
    ip,
    entityId = null,
    transactionType,
    isMobilePlatform = null,
    isRaiseGreenDay = false,
  }: fundsType) {
    this.campaignId = campaignId;
    this.amount = amount;
    this.userId = userId;
    this.ip = ip;
    this.investorId = investorId;
    this.entityId = entityId;
    this.transactionType = transactionType;
    this.isMobilePlatform = isMobilePlatform;
    this.isRaiseGreenDay = isRaiseGreenDay;
  }

  CampaignId() {
    return this.campaignId;
  }

  Amount() {
    return this.amount;
  }

  UserId() {
    return this.userId;
  }

  InvestorId() {
    return this.investorId;
  }

  Ip() {
    return this.ip;
  }

  EntityId() {
    return this.entityId;
  }

  TransactionType() {
    return this.transactionType.toUpperCase();
  }

  IsMobilePlatform() {
    return this.isMobilePlatform;
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

export default CreateCampaignFundDTO;
