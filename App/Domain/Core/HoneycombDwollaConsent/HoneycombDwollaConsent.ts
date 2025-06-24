import uuid from 'uuid/v4';
class HoneycombDwollaConsent {
  honeycombDwollaConsentId: string;
  consentDate: Date;
  userId: string | null;
  issuerId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(honeycombDwollaConsentId: string, consentDate: Date) {
    this.honeycombDwollaConsentId = honeycombDwollaConsentId;
    this.consentDate = consentDate;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  setIssuerId(issuerId: string) {
    this.issuerId = issuerId;
  }

  getHoneycombDwollaConsentId() {
    return this.honeycombDwollaConsentId;
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
   * Set Deleted Date
   * @param {Date} deletedAt
   */
  setDeletedAT(deletedAt: Date) {
    this.deletedAt = deletedAt;
  }

  static createFromObject(honeycombConsentObject) {
    const honeycombConsent = new HoneycombDwollaConsent(
      honeycombConsentObject.honeycombDwollaConsentId,
      honeycombConsentObject.consentDate,
    );

    if (honeycombConsentObject.createdAt) {
      honeycombConsent.setCreatedAt(honeycombConsentObject.createdAt);
    }

    if (honeycombConsentObject.updatedAt) {
      honeycombConsent.setUpdatedAt(honeycombConsentObject.updatedAt);
    }

    if (honeycombConsentObject.deletedAt) {
      honeycombConsent.setDeletedAT(honeycombConsentObject.deletedAt);
    }

    if (honeycombConsentObject.issuerId) {
      honeycombConsent.setIssuerId(honeycombConsentObject.issuerId);
    }

    if (honeycombConsentObject.userId) {
      honeycombConsent.setUserId(honeycombConsentObject.issuerId);
    }

    return honeycombConsent;
  }

  static createFromDetail(consentDate: Date) {
    return new HoneycombDwollaConsent(uuid(), consentDate);
  }
}

export default HoneycombDwollaConsent;
