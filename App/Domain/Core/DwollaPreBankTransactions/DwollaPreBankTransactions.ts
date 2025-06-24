import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class DwollaPreBankTransactions extends BaseEntity {
  private readonly dwollaPreBankTransactionId: string;
  private readonly uploadId: string;
  private readonly source: string;
  private readonly destination: string;
  private readonly issuerName: string;
  private readonly businessOwnerName: string;
  private readonly businessOwnerEmail: string;
  private readonly amount: number;
  private readonly status: string;
  private readonly errorMessage: string;

  constructor({
    dwollaPreBankTransactionId,
    uploadId,
    source,
    destination,
    issuerName,
    businessOwnerName,
    businessOwnerEmail,
    amount,
    status,
    errorMessage,
  }) {
    super();
    this.dwollaPreBankTransactionId = dwollaPreBankTransactionId;
    this.uploadId = uploadId;
    this.source = source;
    this.destination = destination;
    this.issuerName = issuerName;
    this.businessOwnerName = businessOwnerName;
    this.businessOwnerEmail = businessOwnerEmail;
    this.amount = amount;
    this.status = status;
    this.errorMessage = errorMessage;
  }

  getDwollaPreBankTransactionId() {
    return this.dwollaPreBankTransactionId;
  }

  getUploadId() {
    return this.uploadId;
  }

  getSource() {
    return this.source;
  }

  getDestination() {
    return this.destination;
  }

  getIssuerName() {
    return this.issuerName;
  }

  getBusinessOwnerName() {
    return this.businessOwnerName;
  }

  getBusinessOwnerEmail() {
    return this.businessOwnerEmail;
  }

  getAmount() {
    return this.amount;
  }

  getStatus() {
    return this.status;
  }

  getErrorMessage() {
    return this.errorMessage;
  }

  static createFromObject(dwollaPreBankTransactionObj) {
    const dwollaPreBankTransaction = new DwollaPreBankTransactions(
      dwollaPreBankTransactionObj,
    );

    if (dwollaPreBankTransactionObj.createdAt) {
      dwollaPreBankTransaction.setCreatedAt(dwollaPreBankTransactionObj.createdAt);
    }

    if (dwollaPreBankTransactionObj.updatedAt) {
      dwollaPreBankTransaction.setUpdatedAt(dwollaPreBankTransactionObj.updatedAt);
    }

    if (dwollaPreBankTransactionObj.deletedAt) {
      dwollaPreBankTransaction.setDeletedAT(dwollaPreBankTransactionObj.deletedAt);
    }

    return dwollaPreBankTransaction;
  }

  static createFromDetail(dwollaPreBankTransactionProps): DwollaPreBankTransactions {
    return new DwollaPreBankTransactions({
      dwollaPreBankTransactionId: uuid(),
      ...dwollaPreBankTransactionProps,
    });
  }
}

export default DwollaPreBankTransactions;
