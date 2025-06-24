import { UseCase } from '@application/BaseInterface/UseCase';

export const ISendGlobalNotificationUseCaseId = Symbol.for(
  'ISendGlobalNotificationUseCase',
);
type sendGlobalNotification = {
  type: string;
  subject: string;
  body: any;
  notificationPayload: any;
};
type sendGlobalNotificationType = {
  type?: string;
  subject: string;
  body: string;
  users: { firstName: string; email: string; notificationToken: string }[];
  notificationPayload: string;
};
export interface ISendGlobalNotificationUseCase
  extends UseCase<sendGlobalNotification, boolean> {
  sendPushNotifications({
    subject,
    body,
    users,
    notificationPayload,
  }: sendGlobalNotificationType): Promise<boolean>;
  sendEmails({
    subject,
    body,
    users,
  }: {
    subject: string;
    body: string;
    users: [];
  }): Promise<any>;
}
