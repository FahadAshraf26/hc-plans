import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class DwollaPreTransactions extends BaseEntity {
  private readonly dwollaPreTransactionId: string;
  private readonly source: string;
  private readonly destination: string;
  private readonly interestPaid: number;
  private readonly principalPaid: number;
  private readonly total: number;
  private readonly status: string;
  private readonly issuerName: string;
  private readonly campaignName: string;
  private readonly issuerEmail: string;
  private readonly investorName: string;
  private readonly investorEmail: string;
  private readonly investorType: string;
  private readonly entityName: string;
  private readonly uploadId: string;
  private readonly errorMessage: string;
  private fileName: string;

  constructor({
    dwollaPreTransactionId,
    source,
    destination,
    interestPaid,
    principalPaid,
    total,
    status,
    issuerName,
    campaignName,
    issuerEmail,
    investorName,
    investorEmail,
    investorType,
    entityName,
    uploadId,
    errorMessage,
    fileName,
  }) {
    super();
    this.dwollaPreTransactionId = dwollaPreTransactionId;
    this.source = source;
    this.destination = destination;
    this.interestPaid = interestPaid;
    this.principalPaid = principalPaid;
    this.total = total;
    this.status = status;
    this.issuerName = issuerName;
    this.campaignName = campaignName;
    this.issuerEmail = issuerEmail;
    this.investorName = investorName;
    this.investorEmail = investorEmail;
    this.investorType = investorType;
    this.entityName = entityName;
    this.uploadId = uploadId;
    this.errorMessage = errorMessage;
    this.fileName = fileName;
  }

  getDwollaPreTransactionId() {
    return this.dwollaPreTransactionId;
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

  getIssuerName() {
    return this.issuerName;
  }

  getCampaignName() {
    return this.campaignName;
  }

  getIssuerEmail() {
    return this.issuerEmail;
  }

  getInvestorName() {
    return this.investorName;
  }

  getInvestorEmail() {
    return this.investorEmail;
  }

  getInvestorType() {
    return this.investorType;
  }

  getEntityName() {
    return this.entityName;
  }

  getUploadId() {
    return this.uploadId;
  }

  getErrorMessage() {
    return this.errorMessage;
  }

  getFileName() {
    return this.fileName;
  }

  static createFromObject(dwollaPreTransactionObj) {
    const dwollaPreTransaction = new DwollaPreTransactions(dwollaPreTransactionObj);

    if (dwollaPreTransactionObj.createdAt) {
      dwollaPreTransaction.setCreatedAt(dwollaPreTransactionObj.createdAt);
    }

    if (dwollaPreTransactionObj.updatedAt) {
      dwollaPreTransaction.setUpdatedAt(dwollaPreTransactionObj.updatedAt);
    }

    if (dwollaPreTransactionObj.deletedAt) {
      dwollaPreTransaction.setDeletedAT(dwollaPreTransactionObj.deletedAt);
    }

    return dwollaPreTransaction;
  }

  static createFromDetail(dwollaPreTransactionProps): DwollaPreTransactions {
    return new DwollaPreTransactions({
      dwollaPreTransactionId: uuid(),
      ...dwollaPreTransactionProps,
    });
  }
}

export default DwollaPreTransactions;
