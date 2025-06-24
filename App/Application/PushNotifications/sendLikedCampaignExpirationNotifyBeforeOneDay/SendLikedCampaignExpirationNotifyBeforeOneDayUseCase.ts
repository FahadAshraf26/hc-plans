import PushNotificationMessages from '@domain/Utils/PushNotificationMessages';
import { PushNotificationStatus } from '@domain/Core/ValueObjects/PushNotificationStatus';
import PushNotification from '@domain/Core/PushNotification/PushNotification';
import { PushNotificationResourceType } from '@domain/Core/ValueObjects/PushNotficationResourceType';
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
import { ISendLikedCampaignExpirationNotifyBeforeOneDayUseCase } from '@application/PushNotifications/sendLikedCampaignExpirationNotifyBeforeOneDay/ISendLikedCampaignExpirationNotifyBeforeOneDayUseCase';

@injectable()
class SendLikedCampaignExpirationNotifyBeforeOneDayUseCase
  implements ISendLikedCampaignExpirationNotifyBeforeOneDayUseCase {
  constructor(
    @inject(INotificationServiceId) private notificationService: INotificationService,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IPushNotificationDAOId) private pushNotificationDAO: IPushNotificationDAO,
  ) {}

  notificationsAndUsers(notifiableUsers, title, campaign, body) {
    return notifiableUsers.map((userObj) => {
      return {
        notification: this.notificationService.createNotification({
          token: userObj.notificationToken,
          title: PushNotificationMessages.replaceCampaignName(
            title,
            campaign.campaignName,
          ),
          description: PushNotificationMessages.replaceCampaignName(
            body,
            campaign.campaignName,
          ),
          data: {
            issuerId: campaign.issuerId,
            campaignId: campaign.campaignId,
            resourceType: PushNotificationResourceType.CAMPAIGN,
            title: PushNotificationMessages.replaceCampaignName(
              title,
              campaign.campaignName,
            ),
            description: PushNotificationMessages.replaceCampaignName(
              body,
              campaign.campaignName,
            ),
          },
        }),
        user: userObj,
      };
    });
  }

  pushNotificationRecords(tickets, filteredUsers, body, campaign) {
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
        PushNotificationMessages.replaceCampaignName(body, campaign.campaignName),
        ticketId,
        status,
        filteredUsers[index] ? filteredUsers[index].data : null,
        PushNotificationResourceType.CAMPAIGN,
      );
    });
  }

  async execute({ campaign, users }) {
    const notifiableUsers = users.filter((user) => user.fcmToken);

    const { title, body } = PushNotificationMessages.LikedCampaignReminder24Hours;

    const notificationsAndUsers = this.notificationsAndUsers(
      notifiableUsers,
      title,
      campaign,
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
      campaign,
    );

    await this.pushNotificationDAO.addBulk(pushNotificationRecords);

    return true;
  }
}

export default SendLikedCampaignExpirationNotifyBeforeOneDayUseCase;
