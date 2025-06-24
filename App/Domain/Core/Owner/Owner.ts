import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class Owner extends BaseEntity {
  ownerId: string;
  private userId: string;
  private title: string;
  private subTitle: string;
  private description: string;
  private beneficialOwner: boolean;
  primaryOwner: boolean;
  issuers: any;
  beneficialOwnerId: string;
  user: any;
  private businessOwner: boolean;
  dwollaBeneficialOwner: any;

  constructor(
    ownerId: string,
    userId: string,
    title: string,
    subTitle: string,
    description: string,
    primaryOwner: boolean,
    beneficialOwner: boolean,
    businessOwner: boolean,
  ) {
    super();
    this.ownerId = ownerId;
    this.userId = userId;
    this.title = title;
    this.subTitle = subTitle;
    this.description = description;
    this.primaryOwner = primaryOwner;
    this.beneficialOwner = beneficialOwner;
    this.issuers = [];
    this.businessOwner = businessOwner;
  }

  setBeneficialOwnerId(beneficialOwnerId: string) {
    this.beneficialOwnerId = beneficialOwnerId;
  }

  setUser(user: any) {
    this.user = user;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  setDwollaBeneficialOwner(dwollaBeneficialOwner) {
    this.dwollaBeneficialOwner = dwollaBeneficialOwner;
  }

  setIssuer(issuer: any) {
    this.issuers.push(issuer);
  }

  setBusinessOwner(businessOwner) {
    this.businessOwner = businessOwner;
  }

  /**
   * Create Owner Object
   * @param {object} ownerObj
   * @returns Owner
   */
  static createFromObject(ownerObj) {
    const owner = new Owner(
      ownerObj.ownerId,
      ownerObj.userId,
      ownerObj.title,
      ownerObj.subTitle,
      ownerObj.description,
      ownerObj.primaryOwner,
      ownerObj.beneficialOwner,
      ownerObj.businessOwner,
    );

    if (ownerObj.beneficialOwnerId) {
      owner.setBeneficialOwnerId(ownerObj.beneficialOwnerId);
    }

    if (ownerObj.createdAt) {
      owner.setCreatedAt(ownerObj.createdAt);
    }

    if (ownerObj.updatedAt) {
      owner.setUpdatedAt(ownerObj.updatedAt);
    }

    if (ownerObj.deletedAt) {
      owner.setDeletedAT(ownerObj.deletedAt);
    }

    if (ownerObj.dwollaBeneficialOwner) {
      owner.setDwollaBeneficialOwner(ownerObj.dwollaBeneficialOwner);
    }

    return owner;
  }

  toPublicDTO() {
    const {
      primaryOwner,
      beneficialOwner,
      businessOwner,
      beneficialOwnerId,
      ...rest
    } = this;

    return rest;
  }

  /**
   * Create Owner Object with Id
   * @param {string} userId
   * @param {string} title
   * @param subTitle
   * @param {string} description
   * @param primaryOwner
   * @param beneficialOwner
   * @param businessOwner
   * @returns Owner
   */
  static createFromDetail(
    userId: string,
    title: string,
    subTitle: string,
    description: string,
    primaryOwner: boolean = false,
    beneficialOwner: boolean = false,
    businessOwner: boolean = false,
  ) {
    return new Owner(
      uuid(),
      userId,
      title,
      subTitle,
      description,
      primaryOwner,
      beneficialOwner,
      businessOwner,
    );
  }
}

export default Owner;
