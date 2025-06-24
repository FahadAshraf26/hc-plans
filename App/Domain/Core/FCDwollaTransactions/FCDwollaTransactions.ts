import uuid from 'uuid/v4';
import BaseEntity from '../BaseEntity/BaseEntity';

export default class FCDwollaTransactions extends BaseEntity {
  fcDwollaTransactionsId: string;
  status: string;
  amount: number;
  requestedBy: string;
  dwollaTransactionId: string;

  constructor({
    bankToDwollaTransactionsId,
    status,
    amount,
    requestedBy,
    dwollaTransactionId,
  }) {
    super();
    this.fcDwollaTransactionsId = bankToDwollaTransactionsId;
    this.status = status;
    this.amount = amount;
    this.requestedBy = requestedBy;
    this.dwollaTransactionId = dwollaTransactionId;
  }

  static createFromObject(props) {
    const fcDwollaTransactions = new FCDwollaTransactions(props);

    if (props.createdAt) {
      fcDwollaTransactions.setCreatedAt(props.createdAt);
    }

    if (props.updatedAt) {
      fcDwollaTransactions.setUpdatedAt(props.updatedAt);
    }

    if (props.deletedAt) {
      fcDwollaTransactions.setDeletedAT(props.deletedAt);
    }
    return fcDwollaTransactions;
  }

  static createFromDetail(FCDwollaTransactionsProps): FCDwollaTransactions {
    return new FCDwollaTransactions({
      fcDwollaTransactionsId: uuid(),
      ...FCDwollaTransactionsProps,
    });
  }
}
