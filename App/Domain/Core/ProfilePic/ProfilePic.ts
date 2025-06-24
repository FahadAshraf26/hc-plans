import uuid from 'uuid/v4';

class ProfilePic {
  private profilePicId: string;
  private readonly name: string;
  path: string;
  mimeType: string;
  userId: string;
  private originalPath: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(
    profilePicId: string,
    name: string,
    path: string,
    mimeType: string,
    userId: string,
    originalPath: string,
  ) {
    this.profilePicId = profilePicId;
    this.name = name;
    this.path = path;
    this.mimeType = mimeType;
    this.userId = userId;
    this.originalPath = originalPath;
  }

  setPath(path: string) {
    this.path = path;
  }

  getPath() {
    return this.path;
  }

  getName() {
    return this.name;
  }

  setMimeType(mimeType: string) {
    this.mimeType = mimeType;
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

  /**
   * Create ProfilePic Object
   * @param {object} picObj
   * @returns ProfilePic
   */
  static createFromObject(picObj) {
    const pic = new ProfilePic(
      picObj.profilePicId,
      picObj.name,
      picObj.path,
      picObj.mimeType,
      picObj.userId,
      picObj.originalPath,
    );

    if (picObj.createdAt) {
      pic.setCreatedAt(picObj.createdAt);
    }
    if (picObj.updatedAt) {
      pic.setUpdatedAt(picObj.updatedAt);
    }

    if (picObj.deletedAt) {
      pic.setDeletedAT(picObj.deletedAt);
    }

    return pic;
  }

  /**
   * Create ProfilePic Object
   * @param {string} name
   * @param {string} path
   * @param {string} mimeType
   * @param {string} userId
   * @param originalPath
   * @returns ProfilePic
   */
  static createFromDetail(name?, path?, mimeType?, userId?, originalPath?) {
    return new ProfilePic(uuid(), name, path, mimeType, userId, originalPath);
  }
}

export default ProfilePic;
