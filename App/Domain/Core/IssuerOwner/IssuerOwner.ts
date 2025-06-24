import uuid from 'uuid/v4';

class IssuerOwner {
  private issuerOwnerId: string;
  private ownerId: string;
  private issuerId: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(issuerOwnerId: string, ownerId: string, issuerId: string) {
    this.issuerOwnerId = issuerOwnerId;
    this.ownerId = ownerId;
    this.issuerId = issuerId;
  }

  /**
   * Set Created Date
   * @param {Date} createdAt
   */
  setCreatedAt(createdAt: Date) {
    this.createdAt = createdAt;
  }

  /**
   * Set Updated Date
   * @param {Date} updatedAt
   */
  setUpdatedAt(updatedAt: Date) {
    this.updatedAt = updatedAt;
  }

  /**
   * Create IssuerOwner Object
   * @param {object} issuerOwnerObj
   * @returns IssuerOwner
   */
  static createFromObject(issuerOwnerObj) {
    const issuerOwner = new IssuerOwner(
      issuerOwnerObj.issuerOwnerId,
      issuerOwnerObj.ownerId,
      issuerOwnerObj.issuerId,
    );
    issuerOwner.setCreatedAt(issuerOwnerObj.createdAt);
    issuerOwner.setUpdatedAt(issuerOwnerObj.updatedAt);

    return issuerOwner;
  }

  /**
   * Create IssuerOwner Object with Id
   * @returns IssuerOwner
   * @param ownerId
   * @param issuerId
   */
  static createFromDetail(ownerId: string, issuerId: string) {
    return new IssuerOwner(uuid(), ownerId, issuerId);
  }
}

export default IssuerOwner;
