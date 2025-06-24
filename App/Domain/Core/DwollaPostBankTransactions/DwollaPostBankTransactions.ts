import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class DwollaPostBankTransactions extends BaseEntity {
  private dwollaPostBankTransactionId: string;
  private source: string;
  private destination: string;
  private status: string;
  private idempotencyId: string;
  private dwollaTransferId: string;
  private businessOwnerName: string;
  private businessOwnerEmail: string;
  private amount: number;
  private dwollaPreBankTransactionId: string;
  private issuerId: string;
  private issuer: any;
  private dwollaCustodyTransferHistoryId: string;

  constructor({
    dwollaPostBankTransactionId,
    source,
    destination,
    status,
    idempotencyId,
    dwollaTransferId,
    businessOwnerName,
    businessOwnerEmail,
    amount,
  }) {
    super();
    this.dwollaPostBankTransactionId = dwollaPostBankTransactionId;
    this.source = source;
    this.destination = destination;
    this.status = status;
    this.idempotencyId = idempotencyId;
    this.dwollaTransferId = dwollaTransferId;
    this.businessOwnerName = businessOwnerName;
    this.businessOwnerEmail = businessOwnerEmail;
    this.amount = amount;
  }

  getDwollaPostBankTransactionId() {
    return this.dwollaPostBankTransactionId;
  }

  getSource() {
    return this.source;
  }

  getDestination() {
    return this.destination;
  }

  getStatus() {
    return this.status;
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

  setDwollaCustodyTransferHistoryId(dwollaCustodyTransferHistoryId: string) {
    this.dwollaCustodyTransferHistoryId = dwollaCustodyTransferHistoryId
  }

  static createFromObject(dwollaPostBankTransactionObj) {
    const dwollaPostBankTransaction = new DwollaPostBankTransactions(
      dwollaPostBankTransactionObj,
    );

    if (dwollaPostBankTransactionObj.createdAt) {
      dwollaPostBankTransaction.setCreatedAt(dwollaPostBankTransactionObj.createdAt);
    }

    if (dwollaPostBankTransactionObj.updatedAt) {
      dwollaPostBankTransaction.setUpdatedAt(dwollaPostBankTransactionObj.updatedAt);
    }

    if (dwollaPostBankTransactionObj.deletedAt) {
      dwollaPostBankTransaction.setDeletedAT(dwollaPostBankTransactionObj.deletedAt);
    }

    return dwollaPostBankTransaction;
  }

  static createFromDetail(dwollaPostBankTransactionProps): DwollaPostBankTransactions {
    return new DwollaPostBankTransactions({
      dwollaPostBankTransactionId: uuid(),
      ...dwollaPostBankTransactionProps,
    });
  }
}

export default DwollaPostBankTransactions;
