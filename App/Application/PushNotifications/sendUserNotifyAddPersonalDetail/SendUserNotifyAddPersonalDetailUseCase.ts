import PushNotificationMessages from '@domain/Utils/PushNotificationMessages';
import { PushNotificationResourceType } from '@domain/Core/ValueObjects/PushNotficationResourceType';
import { PushNotificationStatus } from '@domain/Core/ValueObjects/PushNotificationStatus';
import PushNotification from '@domain/Core/PushNotification/PushNotification';
import { inject, injectable } from 'inversify';
import {
  INotificationService,
  INotificationServiceId,
} from '@infrastructure/Service/NotificationService/INotificationService';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import {
  IPushNotificationDAO,
  IPushNotificationDAOId,
} from '@domain/Core/PushNotification/IPushNotificationDAO';
import { ISendUserNotifyAddPersonalDetailUseCase } from '@application/PushNotifications/sendUserNotifyAddPersonalDetail/ISendUserNotifyAddPersonalDetailUseCase';

@injectable()
class SendUserNotifyAddPersonalDetailUseCase
  implements ISendUserNotifyAddPersonalDetailUseCase {
  constructor(
    @inject(INotificationServiceId) private notificationService: INotificationService,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IPushNotificationDAOId) private pushNotificationDAO: IPushNotificationDAO,
  ) {}

  notificationsAndUsers(notifiableUsers, title, body) {
    return notifiableUsers.map((user) => {
      return {
        notification: this.notificationService.createNotification({
          token: user.notificationToken,
          title: PushNotificationMessages.replaceUserName(title, user.firstName),
          description: body,
          data: {
            userId: user.userId,
            resourceType: PushNotificationResourceType.USER_PROFILE,
            title: PushNotificationMessages.replaceUserName(title, user.firstName),
            description: PushNotificationMessages.replaceCampaignName(body),
          },
        }),
        user,
      };
    });
  }

  pushNotificationRecords(tickets, filteredUsers, body, filteredNotifications) {
    return tickets.map(async (ticket, index) => {
      const status =
        ticket.status === 'error'
          ? PushNotificationStatus.FAILED
          : PushNotificationStatus.SUCCESS;

      if (ticket.status === 'error' && ticket.details.error === 'DeviceNotRegistered') {
        const user = filteredUsers[index];
        user.notificationToken = null;
        await this.userRepository.update(user);
      }

      const ticketId = status === PushNotificationStatus.SUCCESS ? ticket.id : null;

      return PushNotification.createFromDetail(
        filteredUsers[index].userId,
        PushNotificationMessages.replaceUserName(body),
        ticketId,
        status,
        filteredNotifications[index] ? filteredNotifications[index].data : null,
        PushNotificationResourceType.USER_PROFILE,
      );
    });
  }

  async execute(users) {
    const notifiableUsers = users.filter((user) => user.notificationToken);

    const { title, body } = PushNotificationMessages.PersonalDetailsNotProvidedMessage;
    const notificationsAndUsers = this.notificationsAndUsers(
      notifiableUsers,
      title,
      body,
    );
    const filterUsersWithInvalidToken = notificationsAndUsers.filter(
      (item) => item.notification,
    );
    const filteredUsers = filterUsersWithInvalidToken.map((item) => item.user);
    const filteredNotifications = filterUsersWithInvalidToken.map(
      (item) => item.notification,
    );

    const tickets = await this.notificationService.sendNotifications(
      filteredNotifications,
    );

    const pushNotificationRecords = this.pushNotificationRecords(
      tickets,
      filteredUsers,
      body,
      filteredNotifications,
    );

    await this.pushNotificationDAO.addBulk(pushNotificationRecords);

    return true;
  }
}

export default SendUserNotifyAddPersonalDetailUseCase;
