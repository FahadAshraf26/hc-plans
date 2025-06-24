import uuid from 'uuid/v4';
import User from '../User/User';

class UserAppFeedback {
  private userAppFeedbackId: string;
  userId: string;
  private rating: string;
  private text: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  user: User;

  constructor(userAppFeedbackId: string, userId: string, rating: string, text: string) {
    this.userAppFeedbackId = userAppFeedbackId;
    this.userId = userId;
    this.rating = rating;
    this.text = text;
  }

  setUser(user) {
    this.user = user;
  }

  /**
   * Set Created Date
   * @param {Date} createdAt
   */
  setCreatedAt(createdAt) {
    this.createdAt = createdAt;
  }

  /**
   * Set Updated Date
   * @param {Date} updatedAt
   */
  setUpdatedAt(updatedAt) {
    this.updatedAt = updatedAt;
  }

  /**
   * Set Deleted Date
   * @param {Date} deletedAt
   */
  setDeletedAT(deletedAt) {
    this.deletedAt = deletedAt;
  }

  /**
   * Create UserAppFeedback Object
   * @param {object} userAppFeedbackObj
   * @returns UserAppFeedback
   */
  static createFromObject(userAppFeedbackObj): UserAppFeedback {
    const userAppFeedback = new UserAppFeedback(
      userAppFeedbackObj.userAppFeedbackId,
      userAppFeedbackObj.userId,
      userAppFeedbackObj.rating,
      userAppFeedbackObj.text,
    );

    if (userAppFeedbackObj.createdAt) {
      userAppFeedback.setCreatedAt(userAppFeedbackObj.createdAt);
    }

    if (userAppFeedbackObj.updatedAt) {
      userAppFeedback.setUpdatedAt(userAppFeedbackObj.updatedAt);
    }

    if (userAppFeedbackObj.deletedAt) {
      userAppFeedback.setDeletedAT(userAppFeedbackObj.deletedAt);
    }

    return userAppFeedback;
  }

  /**
   * Create UserAppFeedback Object with Id
   * @param {string} userAppFeedback
   * @returns UserAppFeedback
   */
  static createFromDetail(userId, rating, text): UserAppFeedback {
    return new UserAppFeedback(uuid(), userId, rating, text);
  }
}

export default UserAppFeedback;
