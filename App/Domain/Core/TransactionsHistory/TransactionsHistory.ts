import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class TransactionsHistory extends BaseEntity {
  private transactionsHistoryId: string;
  private cashFlowStatus: string;
  private dwollaTransferId: string;
  private campaignName: string;
  private userId: string;
  private amount: string;
  private transferStatus: string;
  constructor({
    transactionsHistoryId,
    cashFlowStatus,
    dwollaTransferId,
    campaignName,
    userId,
    amount,
    transferStatus,
  }) {
    super();
    this.transactionsHistoryId = transactionsHistoryId;
    this.cashFlowStatus = cashFlowStatus;
    this.dwollaTransferId = dwollaTransferId;
    this.campaignName = campaignName;
    this.userId = userId;
    this.amount = amount;
    this.transferStatus = transferStatus;
  }
  getTransactionsHistoryId() {
    return this.transactionsHistoryId;
  }

  getCashFlowStatus() {
    return this.cashFlowStatus;
  }

  getDwollaTransferId() {
    return this.dwollaTransferId;
  }

  getCampaignName() {
    return this.campaignName;
  }

  getUserId() {
    return this.userId;
  }

  getAmount() {
    return this.amount;
  }

  getTransferStatus() {
    return this.transferStatus;
  }

  static createFromObject(transactionsHsitoryObj): TransactionsHistory {
    const transactionHistory = new TransactionsHistory(transactionsHsitoryObj);
    if (transactionsHsitoryObj.createdAt) {
      transactionHistory.setCreatedAt(transactionsHsitoryObj.createdAt);
    }

    if (transactionsHsitoryObj.updatedAt) {
      transactionHistory.setUpdatedAt(transactionsHsitoryObj.updatedAt);
    }

    if (transactionsHsitoryObj.deletedAt) {
      transactionHistory.setDeletedAT(transactionsHsitoryObj.deletedAt);
    }

    return transactionHistory;
  }

  static createFromDetail(transactionsHistoryProps): TransactionsHistory {
    return new TransactionsHistory({
      transactionsHistoryId: uuid(),
      ...transactionsHistoryProps,
    });
  }
}

export default TransactionsHistory;
