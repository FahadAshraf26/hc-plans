import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class DwollaCustodyTransactions extends BaseEntity {
  private dwollaCustodyTransactionId: string;
  private source: string;
  private destination: string;
  private notCompletedStatus: string;
  private completedStatus: string;
  private idempotencyId: string;
  private dwollaTransferId: string;
  private businessOwnerName: string;
  private businessOwnerEmail: string;
  private amount: number;
  private dwollaPreBankTransactionId: string;
  private issuerId: string;
  private issuer: any;
  private isCompleted: boolean = false;
  private failureCode: string;
  private failureReason: string;

  constructor({
    dwollaCustodyTransactionId,
    source,
    destination,
    notCompletedStatus,
    completedStatus,
    idempotencyId,
    dwollaTransferId,
    businessOwnerName,
    businessOwnerEmail,
    amount,
    isCompleted = false,
    dwollaPreBankTransactionId,
    failureCode = null,
    failureReason = null,
  }) {
    super();
    this.dwollaCustodyTransactionId = dwollaCustodyTransactionId;
    this.source = source;
    this.destination = destination;
    this.notCompletedStatus = notCompletedStatus;
    this.completedStatus = completedStatus;
    this.idempotencyId = idempotencyId;
    this.dwollaTransferId = dwollaTransferId;
    this.businessOwnerName = businessOwnerName;
    this.businessOwnerEmail = businessOwnerEmail;
    this.amount = amount;
    this.isCompleted = isCompleted;
    this.dwollaPreBankTransactionId = dwollaPreBankTransactionId;
    this.failureCode = failureCode;
    this.failureReason = failureReason;
  }

  getDwollaCustodyTransactionId() {
    return this.dwollaCustodyTransactionId;
  }

  getAmount() {
    return this.amount;
  }

  getSource() {
    return this.source;
  }

  getDestination() {
    return this.destination;
  }

  getNotCompletedStatus() {
    return this.notCompletedStatus;
  }

  getCompletedStatus() {
    return this.completedStatus;
  }

  getIdempotencyId() {
    return this.idempotencyId;
  }

  getBusinessOwnerName() {
    return this.businessOwnerName;
  }

  getBusinessOwnerEmail() {
    return this.businessOwnerEmail;
  }

  setIssuerId(issuerId: string) {
    this.issuerId = issuerId;
  }

  getIssuerId() {
    return this.issuerId;
  }

  setDwollaPreBankTransactionId(dwollaPreBankTransactionId: string) {
    this.dwollaPreBankTransactionId = dwollaPreBankTransactionId;
  }

  getDwollaPreBankTransactionId() {
    return this.dwollaPreBankTransactionId;
  }
  getDwollaTransferId() {
    return this.dwollaTransferId;
  }

  setIssuers(issuer) {
    this.issuer = issuer;
  }

  setDwollaTransferId(dwollaTransferId: string) {
    this.dwollaTransferId = dwollaTransferId;
  }

  getIsCompleted() {
    return this.isCompleted;
  }

  getFailureCode() {
    return this.failureCode;
  }

  getFailureReason() {
    return this.failureReason;
  }

  setCompletedStatus(status: string): void {
    this.completedStatus = status;
  }

  setNotCompletedStatus(status: string): void {
    this.notCompletedStatus = status;
  }

  setIsCompleted(isCompleted: boolean): void {
    this.isCompleted = isCompleted;
  }

  setFailureCode(failureCode: string) {
    this.failureCode = failureCode;
  }

  setFailureReason(failureReason: string) {
    this.failureReason = failureReason;
  }

  static createFromObject(dwollaCustodyTransactionObj) {
    const dwollaCustodyTransaction = new DwollaCustodyTransactions(
      dwollaCustodyTransactionObj,
    );

    if (dwollaCustodyTransactionObj.createdAt) {
      dwollaCustodyTransaction.setCreatedAt(dwollaCustodyTransactionObj.createdAt);
    }

    if (dwollaCustodyTransactionObj.updatedAt) {
      dwollaCustodyTransaction.setUpdatedAt(dwollaCustodyTransactionObj.updatedAt);
    }

    if (dwollaCustodyTransactionObj.deletedAt) {
      dwollaCustodyTransaction.setDeletedAT(dwollaCustodyTransactionObj.deletedAt);
    }

    return dwollaCustodyTransaction;
  }

  static createFromDetail(dwollaCustodyTransactionProps): DwollaCustodyTransactions {
    return new DwollaCustodyTransactions({
      dwollaCustodyTransactionId: uuid(),
      ...dwollaCustodyTransactionProps,
    });
  }
}

export default DwollaCustodyTransactions;
