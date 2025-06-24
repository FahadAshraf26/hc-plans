import InvestmentAmount from '@domain/Core/CampaignFunds/InvestmentAmount';

type fundsType = {
  campaignId: string;
  amount: number;
  userId: string;
  ip: string;
  entityId?: string;
  transactionType: string;
  isMobilePlatform?: boolean;
};

class EPayDTO {
  private readonly campaignId: string;
  private readonly amount: number;
  private readonly userId: string;
  private readonly ip: string;
  private readonly entityId?: string;
  private readonly transactionType: string;
  private readonly isMobilePlatform?: boolean;
  constructor({
    campaignId,
    amount,
    userId,
    ip,
    entityId = null,
    transactionType,
    isMobilePlatform = null,
  }: fundsType) {
    this.campaignId = campaignId;
    this.amount = amount;
    this.userId = userId;
    this.ip = ip;
    this.entityId = entityId;
    this.transactionType = transactionType;
    this.isMobilePlatform = isMobilePlatform;
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
}
export default EPayDTO;
