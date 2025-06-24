export const INotificationServiceId = Symbol.for('INotificationService');

type CreateNotificationOptions = {
  token: string;
  title: string;
  description: string;
  data: any;
};
type CreateNotificationResponse = {
  to: string;
  sound: string;
  title: string;
  body: string;
  data: any;
  priority: string;
};

export interface INotificationService {
  createNotification({
    token,
    title,
    description,
    data,
  }: CreateNotificationOptions): CreateNotificationResponse;
  sendMulticastNotifications(notifications: any): Promise<any[]>;
  sendNotifications(notifications: any): Promise<any[]>;
  getNotifications(tickets: any[]): Promise<void>;
}
