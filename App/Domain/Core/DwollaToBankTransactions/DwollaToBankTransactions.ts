import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class DwollaToBankTransactions extends BaseEntity {
  private dwollaToBankTransactionId: string;
  private transferStatus: string;
  private amount: number;
  private dwollaTransactionId: string;
  private idempotencyKey: string;
  private userId: string;
  private dwollaSourceId: string;
  private dwollaDestinationId: string;

  constructor({
    dwollaToBankTransactionId,
    transferStatus,
    amount,
    dwollaTransactionId,
    idempotencyKey,
  }) {
    super();
    this.dwollaToBankTransactionId = dwollaToBankTransactionId;
    this.transferStatus = transferStatus;
    this.amount = amount;
    this.dwollaTransactionId = dwollaTransactionId;
    this.idempotencyKey = idempotencyKey;
  }

  getDwollaToBankTransactionId(): string {
    return this.dwollaToBankTransactionId;
  }

  getTransferStatus(): string {
    return this.transferStatus;
  }

  getAmount(): number {
    return this.amount;
  }

  getDwollaTransactionId(): string {
    return this.dwollaTransactionId;
  }

  getIdempotencyKey(): string {
    return this.idempotencyKey;
  }

  setDwollaTransactionId(dwollaTransactionId: string) {
    this.dwollaTransactionId = dwollaTransactionId;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  setDwollaSourceId(dwollaSourceId: string) {
    this.dwollaSourceId = dwollaSourceId;
  }

  setDwollaDestinationId(dwollaDestinationId: string) {
    this.dwollaDestinationId = dwollaDestinationId;
  }

  static createFromObject(dwollaToBankTransactionsObj: any): DwollaToBankTransactions {
    const dwollaToBankTransactions = new DwollaToBankTransactions(
      dwollaToBankTransactionsObj,
    );

    if (dwollaToBankTransactionsObj.createdAt) {
      dwollaToBankTransactions.setCreatedAt(dwollaToBankTransactionsObj.createdAt);
    }

    if (dwollaToBankTransactionsObj.updatedAt) {
      dwollaToBankTransactions.setUpdatedAt(dwollaToBankTransactionsObj.updatedAt);
    }

    if (dwollaToBankTransactionsObj.deletedAt) {
      dwollaToBankTransactions.setDeletedAT(dwollaToBankTransactionsObj.deletedAt);
    }
    return dwollaToBankTransactions;
  }

  static createFromDetail(dwollaToBankTransactionsProps): DwollaToBankTransactions {
    return new DwollaToBankTransactions({
      dwollaToBankTransactionId: uuid(),
      ...dwollaToBankTransactionsProps,
    });
  }
}

export default DwollaToBankTransactions;
