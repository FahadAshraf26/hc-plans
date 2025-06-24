import PushNotification from '@domain/Core/PushNotification/PushNotification';

class UpdateUserNotificationsDTO {
  private readonly pushNotification: PushNotification;
  constructor(pushNotificationObj: any) {
    this.pushNotification = PushNotification.createFromObject(pushNotificationObj);
  }

  getPushNotificationId() {
    return this.pushNotification.pushNotificationId;
  }

  getPushNotification() {
    return this.pushNotification;
  }
}

export default UpdateUserNotificationsDTO;
