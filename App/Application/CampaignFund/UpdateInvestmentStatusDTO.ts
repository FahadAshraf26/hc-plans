import { ChargeStatus } from "@domain/Core/ValueObjects/ChargeStatus";

class UpdateInvestmentStatusDTO {
  private campaignId: string;
  private campaignFundId: string;
  private transactionStatus: string;
  private tradeId?: string;
  private referenceNumber?: string;

  constructor(
    campaignId: string,
    campaignFundId: string,
    transactionStatus: string,
    tradeId?: string,
    referenceNumber?: string
  ) {
    this.campaignId = campaignId;
    this.campaignFundId = campaignFundId;
    this.transactionStatus = transactionStatus;
    this.tradeId = tradeId;
    this.referenceNumber = referenceNumber;
  }

  CampaignId(): string {
    return this.campaignId;
  }

  CampaignFundId(): string {
    return this.campaignFundId;
  }

  TransactionStatus(): string {
    return this.transactionStatus;
  }

  TradeId(): string | undefined {
    return this.tradeId;
  }

  ReferenceNumber(): string | undefined {
    return this.referenceNumber;
  }

  isValidStatus(): boolean {
    return Object.values(ChargeStatus).includes(this.transactionStatus as ChargeStatus);
  }
}

export default UpdateInvestmentStatusDTO;