import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class UserMedia extends BaseEntity {
  private readonly userMediaId: string;
  private readonly userId: string;
  private readonly name: string;
  private type: string;
  private readonly uri: string;
  private readonly mimeType: string;
  private readonly tinyUri: string;
  private readonly dwollaDocumentId: string;

  constructor(
    userMediaId: string,
    userId: string,
    name: string,
    type: string,
    uri: string,
    mimeType: string,
    tinyUri: string,
    dwollaDocumentId = null,
  ) {
    super();
    this.userMediaId = userMediaId;
    this.userId = userId;
    this.name = name;
    this.type = type;
    this.uri = uri;
    this.mimeType = mimeType;
    this.tinyUri = tinyUri;
    this.dwollaDocumentId = dwollaDocumentId;
  }
  /**
   * Create UserMedia Object
   * @param {object} userMediaObj
   * @returns {UserMedia}
   */
  static createFromObject(userMediaObj): UserMedia {
    const userMedia = new UserMedia(
      userMediaObj.userMediaId,
      userMediaObj.userId,
      userMediaObj.name,
      userMediaObj.type,
      userMediaObj.uri,
      userMediaObj.mimeType,
      userMediaObj.tinyUri,
      userMediaObj.dwollaDocumentId,
    );

    if (userMediaObj.createdAt) {
      userMedia.setCreatedAt(userMediaObj.createdAt);
    }

    if (userMediaObj.updatedAt) {
      userMedia.setUpdatedAt(userMediaObj.updatedAt);
    }

    if (userMediaObj.deletedAt) {
      userMedia.setDeletedAT(userMediaObj.deletedAt);
    }

    return userMedia;
  }

  /**
   *
   * @param userId
   * @param name
   * @param type
   * @param uri
   * @param mimeType
   * @param tinyUri
   * @param dwollaDocumentId
   * @returns {UserMedia}
   */
  static createFromDetail(
    userId: string,
    name: string,
    type: string,
    uri: string,
    mimeType: string,
    tinyUri: string,
    dwollaDocumentId = null,
  ): UserMedia {
    return new UserMedia(
      uuid(),
      userId,
      name,
      type,
      uri,
      mimeType,
      tinyUri,
      dwollaDocumentId,
    );
  }
}

export default UserMedia;
