import PushNotificationMessages from '@domain/Utils/PushNotificationMessages';
import { CampaignStage } from '@domain/Core/ValueObjects/CampaignStage';
import { PushNotificationResourceType } from '@domain/Core/ValueObjects/PushNotficationResourceType';
import PushNotification from '@domain/Core/PushNotification/PushNotification';
import { PushNotificationStatus } from '@domain/Core/ValueObjects/PushNotificationStatus';
import { inject, injectable } from 'inversify';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import {
  INotificationService,
  INotificationServiceId,
} from '@infrastructure/Service/NotificationService/INotificationService';
import {
  IPushNotificationDAO,
  IPushNotificationDAOId,
} from '@domain/Core/PushNotification/IPushNotificationDAO';
import { ISendNewCampaignNotificationsUseCase } from '@application/PushNotifications/sendNewCampaignNotifications/ISendNewCampaignNotificationsUseCase';

@injectable()
class SendNewCampaignNotificationsUseCase
  implements ISendNewCampaignNotificationsUseCase {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(INotificationServiceId) private notificationService: INotificationService,
    @inject(IPushNotificationDAOId) private pushNotificationDAO: IPushNotificationDAO,
  ) {}

  notificationsAndUsers(users, message, campaign) {
    return users.map((user) => {
      return {
        notification: this.notificationService.createNotification({
          token: user.notificationToken,
          title: PushNotificationMessages.replaceCampaignName(
            message.title,
            campaign.campaignName,
          ),
          description: PushNotificationMessages.replaceCampaignName(
            message.body,
            campaign.campaignName,
          ),
          data: {
            campaignId: campaign.campaignId,
            issuerId: campaign.issuerId,
            campaignStage: campaign.campaignStage,
            resourceType: PushNotificationResourceType.CAMPAIGN,
            title: PushNotificationMessages.replaceCampaignName(
              message.title,
              campaign.campaignName,
            ),
            description: PushNotificationMessages.replaceCampaignName(
              message.body,
              campaign.campaignName,
            ),
          },
        }),
        user,
      };
    });
  }
  pushNotificationRecords(
    tickets,
    filteredUsers,
    message,
    campaign,
    filteredNotifications,
  ) {
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
        PushNotificationMessages.replaceCampaignName(message.body, campaign.campaignName),
        ticketId,
        status,
        filteredNotifications[index] ? filteredNotifications[index].data : null,
        PushNotificationResourceType.CAMPAIGN,
      );
    });
  }

  async execute(campaign) {
    try {
      const users = await this.userRepository.fetchWithNotificationToken();

      let message;

      if (campaign.campaignStage === CampaignStage.COMING_SOON) {
        message = PushNotificationMessages.CampaignComingSoonMessage;
      }

      if (campaign.campaignStage === CampaignStage.FUNDRAISING) {
        message = PushNotificationMessages.NewLiveCampaignMessage;
      }

      if (!message) {
        return;
      }

      const notificationsAndUsers = this.notificationsAndUsers(users, message, campaign);

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
        message,
        campaign,
        filteredNotifications,
      );

      await this.pushNotificationDAO.addBulk(pushNotificationRecords);

      return true;
    } catch (err) {
      throw err;
    }
  }
}

export default SendNewCampaignNotificationsUseCase;
