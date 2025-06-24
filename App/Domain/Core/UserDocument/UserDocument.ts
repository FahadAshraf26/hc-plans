import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';
import User from '@domain/Core/User/User';

class UserDocument extends BaseEntity {
  userDocumentId: string;
  private userId: string;
  private documentType: string;
  private name: string;
  path: string;
  private mimeType: string;
  private ext: string;
  private user: User;
  private year: number;
  private campaignId: string;

  constructor(
    userDocumentId: string,
    userId: string,
    documentType: string,
    name: string,
    path: string,
    mimeType: string,
    ext: string,
    year: number,
    campaignId: string = null,
  ) {
    super();
    this.userDocumentId = userDocumentId;
    this.userId = userId;
    this.documentType = documentType;
    this.name = name;
    this.path = path;
    this.mimeType = mimeType;
    this.ext = ext;
    this.year = year;
    this.campaignId = campaignId;
  }

  /**
   *
   * @param {User} user
   */
  setUser(user) {
    this.user = user;
  }

  /**
   *
   * @param {object} userDocumentObj
   * @returns UserDocument
   */
  static createFromObject(userDocumentObj) {
    const userDocument = new UserDocument(
      userDocumentObj.userDocumentId,
      userDocumentObj.userId,
      userDocumentObj.documentType,
      userDocumentObj.name,
      userDocumentObj.path,
      userDocumentObj.mimeType,
      userDocumentObj.ext,
      userDocumentObj.year,
      userDocumentObj.campaignId,
    );

    if (userDocumentObj.user) {
      userDocument.setUser(userDocumentObj.user);
    }

    if (userDocumentObj.createdAt) {
      userDocument.setCreatedAt(userDocumentObj.createdAt);
    }

    if (userDocumentObj.updatedAt) {
      userDocument.setUpdatedAt(userDocumentObj.updatedAt);
    }

    if (userDocumentObj.deletedAt) {
      userDocument.setDeletedAT(userDocumentObj.deletedAt);
    }

    return userDocument;
  }

  /**
   *
   * @param {string} userId
   * @param {string} documentType
   * @param {string} name
   * @param {string} path
   * @param {string} mimeType
   * @param {string} ext
   * @param {number} year
   * @returns UserDocument
   *
   */
  static createFromDetail(
    userId,
    documentType,
    name,
    path,
    mimeType,
    ext,
    year = new Date().getFullYear(),
    campaignId = null,
  ) {
    return new UserDocument(
      uuid(),
      userId,
      documentType,
      name,
      path,
      mimeType,
      ext,
      year,
      campaignId,
    );
  }

  getUserId() {
    return this.userId
  }

  getName() {
    return this.name;
  }
}

export default UserDocument;
