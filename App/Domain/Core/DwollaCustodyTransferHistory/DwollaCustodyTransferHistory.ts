import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class DwollaCustodyTransferHistory extends BaseEntity {
  private dwollaCustodyTransferHistoryId: string;
  private source: string;
  private destination: string;
  private dwollaTransferId: string;
  private businessOwnerName: string;
  private businessOwnerEmail: string;
  private amount: number;
  private issuerId: string;
  private issuer: any;

  constructor({
    dwollaCustodyTransferHistoryId,
    source,
    destination,
    dwollaTransferId,
    businessOwnerName,
    businessOwnerEmail,
    amount,
    issuerId,
  }) {
    super();
    this.dwollaCustodyTransferHistoryId = dwollaCustodyTransferHistoryId;
    this.source = source;
    this.destination = destination;
    this.dwollaTransferId = dwollaTransferId;
    this.businessOwnerName = businessOwnerName;
    this.businessOwnerEmail = businessOwnerEmail;
    this.amount = amount;
    this.issuerId = issuerId;
  }

  getDwollaCustodyTransferHistoryId() {
    return this.dwollaCustodyTransferHistoryId;
  }

  getSource() {
    return this.source;
  }

  getDestination() {
    return this.destination;
  }

  getBusinessOwnerName() {
    return this.businessOwnerName;
  }

  getBusinessOwnerEmail() {
    return this.businessOwnerEmail;
  }

  getDwollaTransferId() {
    return this.dwollaTransferId;
  }

  setIssuer(issuer) {
    this.issuer = issuer;
  }

  static createFromObject(dwollaCustodyTransferHistoryObj) {
    const dwollaCustodyTransferHistory = new DwollaCustodyTransferHistory(
      dwollaCustodyTransferHistoryObj,
    );

    if (dwollaCustodyTransferHistoryObj.createdAt) {
      dwollaCustodyTransferHistory.setCreatedAt(
        dwollaCustodyTransferHistoryObj.createdAt,
      );
    }

    if (dwollaCustodyTransferHistoryObj.updatedAt) {
      dwollaCustodyTransferHistory.setUpdatedAt(
        dwollaCustodyTransferHistoryObj.updatedAt,
      );
    }

    if (dwollaCustodyTransferHistoryObj.deletedAt) {
      dwollaCustodyTransferHistory.setDeletedAT(
        dwollaCustodyTransferHistoryObj.deletedAt,
      );
    }

    return dwollaCustodyTransferHistory;
  }

  static createFromDetail(
    dwollaCustodyTransferHistoryProps,
  ): DwollaCustodyTransferHistory {
    return new DwollaCustodyTransferHistory({
      dwollaCustodyTransferHistoryId: uuid(),
      ...dwollaCustodyTransferHistoryProps,
    });
  }
}

export default DwollaCustodyTransferHistory;
