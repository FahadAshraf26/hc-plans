import uuid from 'uuid/v4';

class HoneycombDwollaBeneficialOwner {
  private honeycombDwollaBeneficialOwnerId: string;
  private ownerId: string;
  private dwollaCustomerId: string;
  private dwollaBeneficialOwnerId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(honeycombDwollaBeneficialOwnerId: string, dwollaBeneficialOwnerId) {
    this.honeycombDwollaBeneficialOwnerId = honeycombDwollaBeneficialOwnerId;
    this.dwollaBeneficialOwnerId = dwollaBeneficialOwnerId;
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

  setDeletedAt(deletedAt: Date) {
    this.deletedAt = deletedAt;
  }

  /**
   * Create HoneycombDwollaBeneficialOwner Object
   * @param {object} honeycombDwollaBeneficialOwnerObj
   * @returns HoneycombDwollaBeneficialOwner
   */
  static createFromObject(honeycombDwollaBeneficialOwnerObj) {
    const honeycombDwollaBeneficialOwner = new HoneycombDwollaBeneficialOwner(
      honeycombDwollaBeneficialOwnerObj.honeycombDwollaBeneficialOwnerId,
      honeycombDwollaBeneficialOwnerObj.dwollaBeneficialOwnerId,
    );

    if (honeycombDwollaBeneficialOwnerObj.createdAt) {
      honeycombDwollaBeneficialOwner.setCreatedAt(
        honeycombDwollaBeneficialOwnerObj.createdAt,
      );
    }
    if (honeycombDwollaBeneficialOwnerObj.updatedAt) {
      honeycombDwollaBeneficialOwner.setUpdatedAt(
        honeycombDwollaBeneficialOwnerObj.updatedAt,
      );
    }

    if (honeycombDwollaBeneficialOwnerObj.deletedAt) {
      honeycombDwollaBeneficialOwner.setDeletedAt(
        honeycombDwollaBeneficialOwnerObj.deletedAt,
      );
    }

    return honeycombDwollaBeneficialOwner;
  }

  /**
   * Create HoneycombDwollaBeneficialOwner Object with Id
   * @returns HoneycombDwollaBeneficialOwner
   * @param ownerId
   * @param dwollaCustomerId
   * @param dwollaBeneficialOwnerId
   */
  static createFromDetail(ownerId: string) {
    return new HoneycombDwollaBeneficialOwner(uuid(), ownerId);
  }

  getHoneycombDwollaBeneficialOwnerId() {
    return this.honeycombDwollaBeneficialOwnerId;
  }

  setOwnerId(ownerId) {
    this.ownerId = ownerId;
  }

  getOwnerId() {
    return this.ownerId;
  }

  setDwollaCustomerId(dwollaCustomerId) {
    this.dwollaCustomerId = dwollaCustomerId;
  }

  getDwollaCustomerId() {
    return this.dwollaCustomerId;
  }

  getDwollaBeneficialOwnerId() {
    return this.dwollaBeneficialOwnerId;
  }
}

export default HoneycombDwollaBeneficialOwner;
