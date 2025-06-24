// Domain/Core/UserTagPreference/UserTagPreference.ts
import uuid from 'uuid/v4';

class UserTagPreference {
  userTagPreferenceId: string;
  userId: string;
  tagId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(userTagPreferenceId: string, userId: string, tagId: string) {
    this.userTagPreferenceId = userTagPreferenceId;
    this.userId = userId;
    this.tagId = tagId;
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
  setDeletedAt(deletedAt: Date) {
    this.deletedAt = deletedAt;
  }

  /**
   * Create UserTagPreference Object from database record
   * @param {object} userTagPreferenceObj
   * @returns UserTagPreference
   */
  static createFromObject(userTagPreferenceObj): UserTagPreference {
    const userTagPreference = new UserTagPreference(
      userTagPreferenceObj.userTagPreferenceId,
      userTagPreferenceObj.userId,
      userTagPreferenceObj.tagId,
    );

    if (userTagPreferenceObj.createdAt) {
      userTagPreference.setCreatedAt(userTagPreferenceObj.createdAt);
    }

    if (userTagPreferenceObj.updatedAt) {
      userTagPreference.setUpdatedAt(userTagPreferenceObj.updatedAt);
    }

    if (userTagPreferenceObj.deletedAt) {
      userTagPreference.setDeletedAt(userTagPreferenceObj.deletedAt);
    }

    return userTagPreference;
  }

  /**
   * Create new UserTagPreference with generated ID
   * @param {string} userId
   * @param {string} tagId
   * @returns UserTagPreference
   */
  static createFromDetails(userId: string, tagId: string) {
    return new UserTagPreference(uuid(), userId, tagId);
  }
}

export default UserTagPreference;
