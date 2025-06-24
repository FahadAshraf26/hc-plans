import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class DwollaPostTransactions extends BaseEntity {
  private dwollaPostTransactionId: string;
  private source: string;
  private destination: string;
  private interestPaid: number;
  private principalPaid: number;
  private total: number;
  private status: string;
  private idempotencyId: string;
  private dwollaPreTransactionId: string;
  private issuerId: string;
  private dwollaTransferId: string;
  private issuer: any;
  private fileName: string;
  private investorName: string;
  private investorEmail: string;

  constructor({
    dwollaPostTransactionId,
    source,
    destination,
    interestPaid,
    principalPaid,
    total,
    status,
    idempotencyId,
    dwollaTransferId,
    fileName,
  }) {
    super();
    this.dwollaPostTransactionId = dwollaPostTransactionId;
    this.source = source;
    this.destination = destination;
    this.interestPaid = interestPaid;
    this.principalPaid = principalPaid;
    this.total = total;
    this.status = status;
    this.idempotencyId = idempotencyId;
    this.dwollaTransferId = dwollaTransferId;
    this.fileName = fileName;
  }

  getDwollaPostTransactionId() {
    return this.dwollaPostTransactionId;
  }

  getSource() {
    return this.source;
  }

  getDestination() {
    return this.destination;
  }

  getInterestPaid() {
    return this.interestPaid;
  }

  getPrincipalPaid() {
    return this.principalPaid;
  }

  getTotal() {
    return this.total;
  }

  getStatus() {
    return this.status;
  }

  getIdempotencyId() {
    return this.idempotencyId;
  }

  getFileName() {
    return this.fileName;
  }

  setIssuerId(issuerId: string) {
    this.issuerId = issuerId;
  }

  getIssuerId() {
    return this.issuerId;
  }

  setDwollaPreTransactionId(dwollaPreTransactionId: string) {
    this.dwollaPreTransactionId = dwollaPreTransactionId;
  }

  getDwollaPreTransactionId() {
    return this.dwollaPreTransactionId;
  }
  getDwollaTransferId() {
    return this.dwollaTransferId;
  }

  setIssuers(issuer) {
    this.issuer = issuer;
  }

  setInvestorEmail(email) {
    this.investorEmail = email
  }
  setInvestorName(name) {
    this.investorName = name;
  }

  static createFromObject(dwollaPostTransactionObj) {
    const dwollaPostTransaction = new DwollaPostTransactions(dwollaPostTransactionObj);

    if (dwollaPostTransactionObj.createdAt) {
      dwollaPostTransaction.setCreatedAt(dwollaPostTransactionObj.createdAt);
    }

    if (dwollaPostTransactionObj.updatedAt) {
      dwollaPostTransaction.setUpdatedAt(dwollaPostTransactionObj.updatedAt);
    }

    if (dwollaPostTransactionObj.deletedAt) {
      dwollaPostTransaction.setDeletedAT(dwollaPostTransactionObj.deletedAt);
    }

    return dwollaPostTransaction;
  }

  static createFromDetail(dwollaPostTransactionProps): DwollaPostTransactions {
    return new DwollaPostTransactions({
      dwollaPostTransactionId: uuid(),
      ...dwollaPostTransactionProps,
    });
  }
}

export default DwollaPostTransactions;
