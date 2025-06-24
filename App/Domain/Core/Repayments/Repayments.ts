import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class Repayments extends BaseEntity {
  private readonly repaymentId: string;
  private readonly interest: number;
  private readonly principle: number;
  private readonly status: string;
  private readonly paymentType: string;
  private readonly total: number;
  private readonly accountName: string;
  private readonly importedAt: Date;
  private campaignId: string;
  private investorId: string;
  private dwollaTransferId: string;
  private entityId: string;
  private uploadId: string;
  private campaignName: string;
  constructor(
    repaymentId,
    interest,
    principle,
    status,
    paymentType,
    total,
    accountName,
    importedAt,
  ) {
    super();
    this.repaymentId = repaymentId;
    this.interest = interest;
    this.principle = principle;
    this.status = status;
    this.paymentType = paymentType;
    this.total = total;
    this.accountName = accountName;
    this.importedAt = importedAt;
  }

  getRepaymentId() {
    return this.repaymentId;
  }
  setCampaignId(campaignId) {
    this.campaignId = campaignId;
  }

  setCampaignName(campaignName) {
    this.campaignName = campaignName;
  }

  setInvestorId(investorId) {
    this.investorId = investorId;
  }

  setDwollaTransferId(dwollaTransferId) {
    this.dwollaTransferId = dwollaTransferId;
  }

  getDwollaTransferId() {
    return this.dwollaTransferId;
  }

  setUploadId(uploadId) {
    this.uploadId = uploadId;
  }

  getUploadId() {
    return this.uploadId;
  }

  setEntityId(entityId) {
    this.entityId = entityId;
  }

  getEntityId() {
    return this.entityId;
  }

  static createFromObject(repaymentObj) {
    const repayment = new Repayments(
      repaymentObj.repaymentId,
      repaymentObj.interest,
      repaymentObj.principle,
      repaymentObj.status,
      repaymentObj.paymentType,
      repaymentObj.total,
      repaymentObj.accountName,
      repaymentObj.importedAt,
    );
    if (repaymentObj.createdAt) {
      repayment.setCreatedAt(repaymentObj.createdAt);
    }
    if (repaymentObj.updatedAt) {
      repayment.setUpdatedAt(repaymentObj.updatedAt);
    }
    if (repaymentObj.deletedAt) {
      repayment.setDeletedAT(repaymentObj.deletedAt);
    }

    return repayment;
  }

  static createFromDetail(
    interest,
    principle,
    status,
    paymentType,
    total,
    accountName,
    importedAt = new Date(),
  ) {
    return new Repayments(
      uuid(),
      interest,
      principle,
      status,
      paymentType,
      total,
      accountName,
      importedAt,
    );
  }
}

export default Repayments;
