import uuid from 'uuid/v4';

class HoneycombDwollaCustomer {
  private honeycombDwollaCustomerId: string;
  private dwollaCustomerId: string;
  private customerType: string;
  userId: string | null;
  issuerId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  businessBeneficialOwner: any;
  private isController: boolean | false;
  private isAccountAdmin: boolean | false;
  private dwollaBeneficialOwnerStatus: any;
  private dwollaBalanceId: string;
  private dwollaDocumentId: string | null;

  constructor(
    honeycombDwollaCustomerId: string,
    dwollaCustomerId: string,
    customerType: string,
    isController: boolean,
    isAccountAdmin: boolean,
    dwollaBalanceId: string,
    dwollaDocumentId: string,
  ) {
    this.honeycombDwollaCustomerId = honeycombDwollaCustomerId;
    this.dwollaCustomerId = dwollaCustomerId;
    this.customerType = customerType;
    this.isController = isController;
    this.isAccountAdmin = isAccountAdmin;
    this.dwollaBalanceId = dwollaBalanceId;
    this.dwollaDocumentId = dwollaDocumentId;
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

  static createFromObject(honeycombCustomerObject) {
    const honeycombCustomer = new HoneycombDwollaCustomer(
      honeycombCustomerObject.honeycombDwollaCustomerId,
      honeycombCustomerObject.dwollaCustomerId,
      honeycombCustomerObject.customerType,
      honeycombCustomerObject.isController,
      honeycombCustomerObject.isAccountAdmin,
      honeycombCustomerObject.dwollaBalanceId,
      honeycombCustomerObject.dwollaDocumentId,
    );

    if (honeycombCustomerObject.createdAt) {
      honeycombCustomer.setCreatedAt(honeycombCustomerObject.createdAt);
    }

    if (honeycombCustomerObject.updatedAt) {
      honeycombCustomer.setUpdatedAt(honeycombCustomerObject.updatedAt);
    }

    if (honeycombCustomerObject.deletedAt) {
      honeycombCustomer.setDeletedAT(honeycombCustomerObject.deletedAt);
    }

    if (honeycombCustomerObject.issuerId) {
      honeycombCustomer.setIssuerId(honeycombCustomerObject.issuerId);
    }

    if (honeycombCustomerObject.userId) {
      honeycombCustomer.setUserId(honeycombCustomerObject.userId);
    }

    return honeycombCustomer;
  }

  static createFromDetail(
    dwollaCustomerId,
    customerType,
    isController = false,
    isAccountAdmin = false,
    dwollaBalanceId,
    dwollaDocumentId = null,
  ) {
    return new HoneycombDwollaCustomer(
      uuid(),
      dwollaCustomerId,
      customerType,
      isController,
      isAccountAdmin,
      dwollaBalanceId,
      dwollaDocumentId,
    );
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  setIssuerId(issuerId: string) {
    this.issuerId = issuerId;
  }

  getHoneycombDwollaCustomerId() {
    return this.honeycombDwollaCustomerId;
  }

  getDwollaCustomerId() {
    return this.dwollaCustomerId;
  }

  getCustomerType() {
    return this.customerType;
  }

  setBusinessBeneficialOwner(businessBeneficialOwner) {
    this.businessBeneficialOwner = businessBeneficialOwner;
  }

  getIsController() {
    return this.isController;
  }

  getIsAccountAdmin() {
    return this.isAccountAdmin;
  }

  setDwollaBeneficialOwnerStatus(status) {
    this.dwollaBeneficialOwnerStatus = status;
  }

  getDwollaBeneficialOwnerStatus() {
    return this.dwollaBeneficialOwnerStatus;
  }

  setDwollaBalanceId(dwollaBalanceId) {
    this.dwollaBalanceId = dwollaBalanceId;
  }

  getDwollaBalanceId() {
    return this.dwollaBalanceId;
  }
  setDwollaDocumentId(dwollaDocumentId) {
    this.dwollaDocumentId = dwollaDocumentId;
  }

  getDwollaDocumentId() {
    return this.dwollaDocumentId;
  }

  getIssuerId() {
    return this.issuerId;
  }

  getUserId() {
    return this.userId;
  }
}

export default HoneycombDwollaCustomer;
