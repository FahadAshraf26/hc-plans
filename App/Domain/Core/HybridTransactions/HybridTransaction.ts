import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';
import CampaignFund from '@domain/Core/CampaignFunds/CampaignFund';
import uuid from 'uuid/v4';

class HybridTransaction extends BaseEntity {
  private readonly hybridTransactionId: string;
  private readonly amount: number;
  private readonly transactionType: string;
  private readonly tradeId: string;
  private readonly refrenceNumber: string;
  private dwollaTransactionId: string;
  private individualACHId: string;
  private campaignFundId: string;
  private campaignFund: CampaignFund;
  private applicationFee: number = 0;
  status: string = 'pending';
  private isSent: boolean = false;
  private readonly walletAmount: number = 0;
  source: string;
  private debitAuthorizationId: string;
  achRefunded: boolean;
  private nachaFileName: string
  walletRefunded: boolean;

  constructor({
    hybridTransactionId,
    amount,
    transactionType,
    tradeId,
    refrenceNumber,
    dwollaTransactionId,
    individualACHId,
    applicationFee,
    status,
    isSent,
    walletAmount,
    source,
    debitAuthorizationId,
    achRefunded,
    nachaFileName,
    walletRefunded
  }) {
    super();
    this.hybridTransactionId = hybridTransactionId;
    this.amount = amount;
    this.transactionType = transactionType;
    this.tradeId = tradeId;
    this.refrenceNumber = refrenceNumber;
    this.dwollaTransactionId = dwollaTransactionId;
    this.individualACHId = individualACHId;
    this.applicationFee = applicationFee;
    this.status = status;
    this.isSent = isSent;
    this.walletAmount = walletAmount;
    this.source = source;
    this.debitAuthorizationId = debitAuthorizationId;
    this.achRefunded = achRefunded;
    this.nachaFileName = nachaFileName;
    this.walletRefunded = walletRefunded
  }

  getHybridTransactionId() {
    return this.hybridTransactionId;
  }

  setCampaignFundId(campaignFundId) {
    this.campaignFundId = campaignFundId;
  }

  setStatus(status: string) {
    this.status = status;
  }

  getCampaignFundId() {
    return this.campaignFundId;
  }

  setCampaignFund(campaignFund) {
    this.campaignFund = campaignFund;
  }

  getTradeId() {
    return this.tradeId;
  }

  getAmount() {
    return this.amount;
  }

  getApplicationFee() {
    return this.applicationFee;
  }

  getRefrenceNumber() {
    return this.refrenceNumber;
  }

  setDwollaTransactionId(dwollaTransactionId) {
    this.dwollaTransactionId = dwollaTransactionId;
  }

  setIndividualACHId(individualACHId) {
    this.individualACHId = individualACHId;
  }

  getDwollaTransactionId() {
    return this.dwollaTransactionId;
  }

  getWalletAmount() {
    return this.walletAmount;
  }

  getTransactionType() {
    return this.transactionType;
  }

  getAchRefunded() {
    return this.achRefunded;
  }

  static createFromObject(hybridTransactionObj): HybridTransaction {
    const hybridTransaction = new HybridTransaction(hybridTransactionObj);

    if (hybridTransactionObj.createdAt) {
      hybridTransaction.setCreatedAt(hybridTransactionObj.createdAt);
    }

    if (hybridTransactionObj.updatedAt) {
      hybridTransaction.setUpdatedAt(hybridTransactionObj.updatedAt);
    }

    if (hybridTransactionObj.deletedAt) {
      hybridTransaction.setDeletedAT(hybridTransactionObj.deletedAt);
    }

    if (hybridTransactionObj.campaignFund) {
      hybridTransaction.setCampaignFund(hybridTransactionObj.campaignFund);
    }

    if (hybridTransactionObj.campaignFundId) {
      hybridTransaction.setCampaignFundId(hybridTransactionObj.campaignFundId);
    }
    return hybridTransaction;
  }

  static createFromDetails(props): HybridTransaction {
    return new HybridTransaction({
      hybridTransactionId: uuid(),
      ...props,
    });
  }
}

export default HybridTransaction;
