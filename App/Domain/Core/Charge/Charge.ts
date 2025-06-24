import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';
import uuid from 'uuid/v4';
import { ChargeStatus } from '../ValueObjects/ChargeStatus';
import { ChargeType } from '../ValueObjects/ChargeType';

class Charge extends BaseEntity {
  chargeId: string;
  private dwollaChargeId: string;
  chargeStatus: string;
  private applicationFee: number;
  private chargeType: string;
  private referenceNumber: string;
  refunded: boolean;
  refundRequestDate: Date;
  private refundChargeId: string;
  documentSent: Date | null = null;

  constructor(
    chargeId: string,
    dwollaChargeId: string,
    chargeStatus: string,
    applicationFee: number,
    chargeType: string,
    referenceNumber: string,
    documentSent: Date | null,
  ) {
    super();
    this.chargeId = chargeId;
    this.dwollaChargeId = dwollaChargeId;
    this.chargeStatus = chargeStatus;
    this.applicationFee = applicationFee;
    this.chargeType = chargeType;
    this.referenceNumber = referenceNumber;
    this.documentSent = documentSent;
  }

  /**
   * set if charge is refunded or not
   * @param {boolean} isRefunded
   */
  setIsRefunded(isRefunded: boolean) {
    this.refunded = isRefunded;
  }

  setRefundRequestedDate(date: Date = new Date()) {
    this.refundRequestDate = date;
  }

  undoRefundRequst() {
    this.refundRequestDate = null;
  }

  setParentCharge(refundChargeId: string) {
    this.refundChargeId = refundChargeId;
  }

  setChargeStatus(status) {
    this.chargeStatus = status;
  }

  setApplicationFee(fee) {
    this.applicationFee = fee;
  }

  setReferenceNumber(referenceNumber) {
    this.referenceNumber = referenceNumber;
  }

  DwollaChargeId() {
    return this.dwollaChargeId;
  }

  /**
   * Create Investor bank Object
   * @param {object} chargeObj
   * @returns Investor bank
   */
  static createFromObject(chargeObj): Charge {
    const charge = new Charge(
      chargeObj.chargeId,
      chargeObj.dwollaChargeId,
      chargeObj.chargeStatus,
      chargeObj.applicationFee,
      chargeObj.chargeType,
      chargeObj.referenceNumber,
      chargeObj.documentSent,
    );

    if (chargeObj.refundChargeId) {
      charge.setParentCharge(chargeObj.refundChargeId);
    }

    if (chargeObj.refunded) {
      charge.setIsRefunded(chargeObj.refunded);
    }

    if (chargeObj.refundRequestDate) {
      charge.setRefundRequestedDate(chargeObj.refundRequestDate);
    }

    if (chargeObj.createdAt) {
      charge.setCreatedAt(chargeObj.createdAt);
    }

    if (chargeObj.updatedAt) {
      charge.setUpdatedAt(chargeObj.updatedAt);
    }

    if (chargeObj.deletedAt) {
      charge.setDeletedAT(chargeObj.deletedAt);
    }

    return charge;
  }

  /**
   * Create Investor  Bank Object with Id
   * @param {string} dwollaChargeId
   * @param {string}  chargeStatus
   * @param {number} applicationFee
   * @param {string} chargeType
   * @param referenceNumber
   */
  static createFromDetail(
    dwollaChargeId?: string,
    chargeStatus: string = ChargeStatus.PENDING,
    applicationFee?: number,
    chargeType: string = ChargeType.TRANSFER,
    referenceNumber?: string,
    documentSent: Date = null,
  ): Charge {
    return new Charge(
      uuid(),
      dwollaChargeId,
      chargeStatus,
      applicationFee,
      chargeType,
      referenceNumber,
      documentSent,
    );
  }
}

export default Charge;
