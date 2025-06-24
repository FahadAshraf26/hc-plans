import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class PushNotification extends BaseEntity {
  pushNotificationId: string;
  private userId: string;
  private message: string;
  private expoNotificationId: string;
  private status: string;
  private data: any;
  private visited: boolean;
  private resourceType: string;

  constructor(
    pushNotificationId,
    userId,
    message,
    expoNotificationId,
    status,
    data,
    visited,
    resourceType,
  ) {
    super();
    this.pushNotificationId = pushNotificationId;
    this.userId = userId;
    this.message = message;
    this.expoNotificationId = expoNotificationId;
    this.status = status;
    this.data = data;
    this.visited = visited;
    this.resourceType = resourceType;
  }

  /**
   * Create PushNotification Object
   * @param {object} pushNotificationObj
   * @returns PushNotification
   */
  static createFromObject(pushNotificationObj) {
    const pushNotification = new PushNotification(
      pushNotificationObj.pushNotificationId,
      pushNotificationObj.userId,
      pushNotificationObj.message,
      pushNotificationObj.expoNotificationId,
      pushNotificationObj.status,
      pushNotificationObj.data,
      pushNotificationObj.visited,
      pushNotificationObj.resourceType,
    );

    if (pushNotificationObj.createdAt) {
      pushNotification.setCreatedAt(pushNotificationObj.createdAt);
    }

    if (pushNotificationObj.updatedAt) {
      pushNotification.setUpdatedAt(pushNotificationObj.updatedAt);
    }

    if (pushNotificationObj.deletedAt) {
      pushNotification.setDeletedAT(pushNotificationObj.deletedAt);
    }

    return pushNotification;
  }

  /**
   * Create PushNotification Object with Id
   * @returns PushNotification
   * @param userId
   * @param message
   * @param expoNotificationId
   * @param status
   * @param data
   * @param resourceType
   * @param visited
   */
  static createFromDetail(
    userId,
    message,
    expoNotificationId,
    status,
    data,
    resourceType,
    visited = false,
  ) {
    return new PushNotification(
      uuid(),
      userId,
      message,
      expoNotificationId,
      status,
      data,
      visited,
      resourceType,
    );
  }
}

export default PushNotification;
