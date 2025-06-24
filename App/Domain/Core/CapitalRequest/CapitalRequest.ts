import uuid from 'uuid/v4';
import BaseEntity from '../BaseEntity/BaseEntity';

class CapitalRequest extends BaseEntity {
  private capitalRequestId: string;
  userId: string;
  businessName: string;
  state: string;
  description: string;
  capitalRequired: string;
  capitalReason: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(
    capitalRequestId: string,
    userId: string,
    businessName: string,
    state: string,
    description: string,
    capitalRequired: string,
    capitalReason: string,
  ) {
    super();
    this.capitalRequestId = capitalRequestId;
    this.userId = userId;
    this.businessName = businessName;
    this.state = state;
    this.description = description;
    this.capitalRequired = capitalRequired;
    this.capitalReason = capitalReason;
  }

  /**
   * Create CapitalRequest Object
   * @param {object} capitalRequestObj
   * @returns CapitalRequest
   */
  static createFromObject(capitalRequestObj): CapitalRequest {
    const capitalRequest = new CapitalRequest(
      capitalRequestObj.capitalRequestId,
      capitalRequestObj.userId,
      capitalRequestObj.businessName,
      capitalRequestObj.state,
      capitalRequestObj.description,
      capitalRequestObj.capitalRequired,
      capitalRequestObj.capitalReason,
    );

    if (capitalRequestObj.createdAt) {
      capitalRequest.setCreatedAt(capitalRequestObj.createdAt);
    }

    if (capitalRequestObj.updatedAt) {
      capitalRequest.setUpdatedAt(capitalRequestObj.updatedAt);
    }

    if (capitalRequestObj.deletedAt) {
      capitalRequest.setDeletedAT(capitalRequestObj.deletedAt);
    }

    return capitalRequest;
  }

  /**
   * Create CapitalRequest Object with Id
   * @returns CapitalRequest
   */
  static createFromDetail(
    userId,
    businessName,
    state,
    description,
    capitalRequired,
    capitalReason,
  ): CapitalRequest {
    return new CapitalRequest(
      uuid(),
      userId,
      businessName,
      state,
      description,
      capitalRequired,
      capitalReason,
    );
  }
}

export default CapitalRequest;
