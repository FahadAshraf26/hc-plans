import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import emailTemplates from '@domain/Utils/EmailTemplates';
const { parseGlobalContent } = emailTemplates;
import HttpError from '@infrastructure/Errors/HttpException';
import mailService from '@infrastructure/Service/MailService';
import { inject, injectable } from 'inversify';
import { ISendGlobalNotificationUseCase } from '@application/User/sendGlobalNotification/ISendGlobalNotificationUseCase';
import {
  IPushNotificationService,
  IPushNotificationServiceId,
} from '@application/PushNotifications/IPushNotificationService';
const { SendHtmlEmail } = mailService;

type sendGlobalNotificationType = {
  type?: string;
  subject: string;
  body: string;
  users: { firstName: string; email: string; notificationToken: string }[];
  notificationPayload: string;
};

@injectable()
class SendGlobalNotificationUseCase implements ISendGlobalNotificationUseCase {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IPushNotificationServiceId)
    private pushNotificationService: IPushNotificationService,
  ) {}

  GlobalNotificationType = {
    pushNotification: 'pushNotification',
    emailNotification: 'emailNotification',
  };

  async sendPushNotifications({
    subject,
    body,
    users,
    notificationPayload,
  }: sendGlobalNotificationType) {
    return this.pushNotificationService.sendGlobalNotification(
      users,
      subject,
      body,
      notificationPayload,
    );
  }

  async sendEmails({
    subject,
    body,
    users,
  }: {
    subject: string;
    body: string;
    users: [];
  }) {
    const emailPromises = users.map(({ email }) => {
      const html = parseGlobalContent(body);
      return SendHtmlEmail(email, subject, html);
    });

    return Promise.allSettled(emailPromises);
  }

  async execute({ type, subject, body, notificationPayload }) {
    const users: any = await this.userRepository.fetchAllEmailsAndNotificationToken();

    if (users.length === 0) {
      throw new HttpError(400, 'no users');
    }

    if (type === this.GlobalNotificationType.pushNotification) {
      const filteredUsers = users.filter((user) => !!user.getNotificationToken());
      await this.sendPushNotifications({
        subject,
        body,
        notificationPayload,
        users: filteredUsers,
      });
    }

    if (type === this.GlobalNotificationType.emailNotification) {
      const filteredUsers: any = users.filter((user) => !!user.email);
      await this.sendEmails({ subject, body, users: filteredUsers });
    }

    return true;
  }
}

export default SendGlobalNotificationUseCase;
