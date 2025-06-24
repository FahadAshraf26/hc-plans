import admin from 'firebase-admin';
import { INotificationService } from '@infrastructure/Service/NotificationService/INotificationService';
import { injectable } from 'inversify';
import fs from 'fs';
import config from '@infrastructure/Config';

@injectable()
class NotificationService implements INotificationService {
  private firebaseClient;

  
  createNotification({ token, title, description, data }) {
    return {
      to: token,
      sound: 'default',
      title,
      body: description,
      data,
      priority: 'high',
    };
  }

  async sendMulticastNotifications(notification) {
    
    const firebaseRawData = fs.readFileSync(config.firebase.FIREBASE_PRIVATE_KEY, 'utf8');
    
    const fireBaseCertificateData = JSON.parse(firebaseRawData);

    this.firebaseClient = admin.initializeApp({
      credential: admin.credential.cert({
          projectId: fireBaseCertificateData.project_id,
          privateKey: fireBaseCertificateData.private_key,
          clientEmail: fireBaseCertificateData.client_email,
        }
      )
    });

    let tickets = [];
    try {
      const result = await this.firebaseClient.messaging().sendMulticast(notification);
      tickets = result.responses.map((res) => (res.success ? 1 : 0));
    } catch (err) {
      throw err;
    }
    return tickets;
  }

  async sendNotifications(notifications) {
    let tickets = [];
    try {
      const notificationPromises = [];
      notifications.forEach((notification) => {
        notificationPromises.push(admin.messaging().sendAll([notification]));
      });
      const result = await Promise.allSettled(notificationPromises);
      tickets = result.map((res) =>
        res.status === 'fulfilled' ? res.value[0] : res.reason,
      );
    } catch (err) {
      throw err;
    }
    return tickets;
  }

  async getNotifications(tickets) {
    // const receiptIds = tickets.map((ticket) => ticket.id);
    // const receiptIdChunks = admin.messaging().chunkPushNotificationReceiptIds(receiptIds);
    //
    // for (const chunk of receiptIdChunks) {
    //   const receipt = await expo.getPushNotificationReceiptsAsync(chunk);
    //   Object.keys(receipt).forEach((key) => {
    //     if (receipt[key].status === 'error') {
    //       //handle errorsa
    //     }
    //   });
    // }
  }
}

export default NotificationService;
