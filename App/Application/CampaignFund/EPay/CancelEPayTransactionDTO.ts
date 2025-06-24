type fundsType = {
  campaignId: string;
  userId: string;
  transferId: string;
  referenceNumber: string;
  transactionType: string;
};

class CancelEPayTransactionDTO {
  private readonly campaignId: string;
  private readonly userId: string;
  private readonly transferId: string;
  private readonly referenceNumber: string;
  private readonly transactionType: string;

  constructor({
    campaignId,
    userId,
    transferId,
    referenceNumber,
    transactionType,
  }: fundsType) {
    this.campaignId = campaignId;
    this.userId = userId;
    this.transferId = transferId;
    this.referenceNumber = referenceNumber;
    this.transactionType = transactionType;
  }

  CampaignId() {
    return this.campaignId;
  }

  UserId() {
    return this.userId;
  }

  TransferId() {
    return this.transferId;
  }

  ReferenceId() {
    return this.referenceNumber;
  }

  TransactionType() {
    return this.transactionType;
  }
}

export default CancelEPayTransactionDTO;
