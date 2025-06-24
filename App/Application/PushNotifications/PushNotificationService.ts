import HttpException from '@infrastructure/Errors/HttpException';
import PushNotificationMessages from '@domain/Utils/PushNotificationMessages';
import { PushNotificationStatus } from '@domain/Core/ValueObjects/PushNotificationStatus';
import PushNotification from '@domain/Core/PushNotification/PushNotification';
import { PushNotificationResourceType } from '@domain/Core/ValueObjects/PushNotficationResourceType';
import { inject, injectable } from 'inversify';
import {
  IPushNotificationDAO,
  IPushNotificationDAOId,
} from '@domain/Core/PushNotification/IPushNotificationDAO';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import {
  ICampaignRepository,
  ICampaignRepositoryId,
} from '@domain/Core/Campaign/ICampaignRepository';
import {
  INotificationService,
  INotificationServiceId,
} from '@infrastructure/Service/NotificationService/INotificationService';
import { IPushNotificationService } from '@application/PushNotifications/IPushNotificationService';
import { CampaignStage } from '@domain/Core/ValueObjects/CampaignStage';
import PushNotificationDAO from '@infrastructure/MySQLRepository/PushNotificationDAO';

@injectable()
class PushNotificationService implements IPushNotificationService {
  constructor(
    @inject(IPushNotificationDAOId) private pushNotificationDAO: IPushNotificationDAO,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(ICampaignRepositoryId) private campaignRepository: ICampaignRepository,
    @inject(INotificationServiceId) private notificationService: INotificationService,
  ) {}
  async getUserNotifications(getUserNotificationsDTO) {
    const result = await this.pushNotificationDAO.fetchByUserId(
      getUserNotificationsDTO.getUserId(),
      {
        paginationOptions: getUserNotificationsDTO.getPaginationOptions(),
      },
    );

    return result.getPaginatedData();
  }

  async updateUserNotification(updateUserNotificationDTO) {
    const userNotification = await this.pushNotificationDAO.fetchById(
      updateUserNotificationDTO.getPushNotificationId(),
    );

    if (!userNotification) {
      throw new HttpException(
        404,
        'No user notification record exists against provided input',
      );
    }

    const result = await this.pushNotificationDAO.update(
      updateUserNotificationDTO.getPushNotification(),
    );

    if (!result) {
      throw new HttpException(400, 'user notification update failed');
    }

    return result;
  }

  /**
   * send global push notification to all users
   * @param inputUsers
   * @param {*} subject,body
   * @param body
   * @param data
   * @returns true
   */
  async sendGlobalNotification(inputUsers, subject, body, data = {}) {
    try {
      const userNotifications = inputUsers.map((user) => {
        return {
          notification: this.notificationService.createNotification({
            token: user.notificationToken,
            title: subject,
            description: body,
            data: {
              ...data,
              userId: user.userId,
              resourceType: PushNotificationResourceType.GLOBAL_NOTIFICATION,
            },
          }),
          user,
        };
      });

      const { users, notifications } = userNotifications
        .filter((notification) => !!notification.notification)
        .reduce(
          (res, x) => {
            return {
              notifications: [...res.notifications, x.notification],
              users: [...res.users, x.user],
            };
          },
          {
            notifications: [],
            users: [],
          },
        );

      let pushNotificationsRecords = notifications.map((_, index) =>
        PushNotification.createFromDetail(
          users[index].userId,
          body,
          null,
          PushNotificationStatus.PENDING,
          {
            ...data,
            userId: users[index].userId,
            resourceType: PushNotificationResourceType.GLOBAL_NOTIFICATION,
          },
          PushNotificationResourceType.GLOBAL_NOTIFICATION,
        ),
      );

      const tickets = await this.notificationService.sendNotifications(notifications);
      pushNotificationsRecords = tickets.map((ticket, index) => {
        if (ticket.status === 'error' && ticket.details.error === 'DeviceNotRegistered') {
          const user = users[index];
          user.notificationToken = null;
          this.userRepository.update(user);
        }
        const record = pushNotificationsRecords[index];
        if (record) {
          record.status =
            ticket.status === 'error'
              ? PushNotificationStatus.FAILED
              : PushNotificationStatus.SUCCESS;
          record.ticketId =
            record.status === PushNotificationStatus.SUCCESS ? ticket.id : null;
        }
        return record;
      });

      await this.pushNotificationDAO.addBulk(pushNotificationsRecords);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async sendSuccessfulCampaignNotifications(campaign, users) {
    const notifiableUsers = users.filter((user) => user.notificationToken);

    const { title, body } = PushNotificationMessages.CampaignIsFundedMessage;

    const notificationsAndUsers = notifiableUsers.map((user) => {
      return {
        notification: this.notificationService.createNotification({
          token: user.notificationToken,
          title: PushNotificationMessages.replaceCampaignName(
            title,
            campaign.campaignName,
          ),
          description: PushNotificationMessages.replaceCampaignName(
            body,
            campaign.campaignName,
          ),
          data: {
            campaignId: campaign.campaignId,
            issuerId: campaign.issuerId,
            campaignStage: campaign.campaignStage,
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
        user,
      };
    });

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

    const pushNotificationRecords = tickets.map((ticket, index) => {
      const status =
        ticket.status === 'error'
          ? PushNotificationStatus.FAILED
          : PushNotificationStatus.SUCCESS;

      if (ticket.status === 'error' && ticket.details.error === 'DeviceNotRegistered') {
        const user = filteredUsers[index];
        user.notificationToken = null;
        this.userRepository.update(user);
      }

      const ticketId = status === PushNotificationStatus.SUCCESS ? ticket.id : null;

      return PushNotification.createFromDetail(
        filteredUsers[index].userId,
        PushNotificationMessages.replaceCampaignName(body, campaign.campaignName),
        ticketId,
        status,
        filteredNotifications[index] ? filteredNotifications[index].data : null,
        PushNotificationResourceType.CAMPAIGN,
      );
    });

    await this.pushNotificationDAO.addBulk(pushNotificationRecords);

    return true;
  }

  async sendNewCampaignQANotifications(campaignQA, user, ownerUsers, issuerId) {
    const notifiableUsers = ownerUsers.filter((user) => user.notificationToken);

    const { title, body } = PushNotificationMessages.IssuerQuestionMessage;
    const notificationsAndUsers = notifiableUsers.map((userObj) => {
      return {
        notification: this.notificationService.createNotification({
          token: userObj.notificationToken,
          title: PushNotificationMessages.replaceUserName(title, user.firstName),
          description: PushNotificationMessages.replaceUserName(body, user.firstName),
          data: {
            campaignId: campaignQA.campaignId,
            campaignQAId: campaignQA.campaignQAId,
            parentQuestionId: campaignQA.parentId,
            ownerId: userObj.userId,
            userIDAskedQuestion: campaignQA.userId,
            resourceType: PushNotificationResourceType.NEW_CAMPAIGN_QA,
            issuerId,
            title: PushNotificationMessages.replaceUserName(title, user.firstName),
            description: PushNotificationMessages.replaceUserName(body, user.firstName),
          },
        }),
        user: userObj,
      };
    });

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

    const pushNotificationRecords = tickets.map((ticket, index) => {
      const status =
        ticket.status === 'error'
          ? PushNotificationStatus.FAILED
          : PushNotificationStatus.SUCCESS;

      if (ticket.status === 'error' && ticket.details.error === 'DeviceNotRegistered') {
        const user = filteredUsers[index];
        user.notificationToken = null;
        this.userRepository.update(user);
      }

      const ticketId = status === PushNotificationStatus.SUCCESS ? ticket.id : null;

      return PushNotification.createFromDetail(
        filteredUsers[index].userId,
        PushNotificationMessages.replaceUserName(body, user.firstName),
        ticketId,
        status,
        filteredNotifications[index] ? filteredNotifications[index].data : null,
        PushNotificationResourceType.NEW_CAMPAIGN_QA,
      );
    });

    await this.pushNotificationDAO.addBulk(pushNotificationRecords);

    return true;
  }

  async sendUnSuccessfulCampaignNotifications(campaign, users) {
    const notifiableUsers = users.filter((user) => user.notificationToken);

    const { title, body } = PushNotificationMessages.CampaignFailedMessage;

    const notificationsAndUsers = notifiableUsers.map((user) => {
      return {
        notification: this.notificationService.createNotification({
          token: user.notificationToken,
          title: PushNotificationMessages.replaceCampaignName(
            title,
            campaign.campaignName,
          ),
          description: PushNotificationMessages.replaceCampaignName(
            body,
            campaign.campaignName,
          ),
          data: {
            campaignId: campaign.campaignId,
            issuerId: campaign.issuerId,
            campaignStage: campaign.campaignStage,
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
        user,
      };
    });

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

    const pushNotificationRecords = tickets.map((ticket, index) => {
      const status =
        ticket.status === 'error'
          ? PushNotificationStatus.FAILED
          : PushNotificationStatus.SUCCESS;

      if (ticket.status === 'error' && ticket.details.error === 'DeviceNotRegistered') {
        const user = filteredUsers[index];
        user.notificationToken = null;
        this.userRepository.update(user);
      }

      const ticketId = status === PushNotificationStatus.SUCCESS ? ticket.id : null;

      return PushNotification.createFromDetail(
        filteredUsers[index].userId,
        PushNotificationMessages.replaceCampaignName(body, campaign.campaignName),
        ticketId,
        status,
        filteredNotifications[index] ? filteredNotifications[index].data : null,
        PushNotificationResourceType.CAMPAIGN,
      );
    });

    await this.pushNotificationDAO.addBulk(pushNotificationRecords);

    return true;
  }

  async setUserNotificationAsMarked(markUserNotificationAsVisitedDTO) {
    const result = await this.pushNotificationDAO.setUserNotificationAsVisited(
      markUserNotificationAsVisitedDTO.getUserId(),
    );

    if (!result) {
      throw new HttpException(400, 'user notification update failed');
    }

    return result;
  }

  async setCampaignQANotificationAsMarked(markCampaignQANotificationDTO) {
    const result = await this.pushNotificationDAO.setCampaignQANotificationAsVisited(
      markCampaignQANotificationDTO.getUserId(),
      markCampaignQANotificationDTO.getCampaignId(),
    );

    if (!result) {
      throw new HttpException(400, 'campaign QA notification update failed');
    }

    return result;
  }
  /**
   * It will send notification is user identity is verified
   * @param {*} user
   */
  async sendIdologyIdVerifiedNotification(user) {
    try {
      const { title, body } = PushNotificationMessages.IdVerifiedMessage;

      const notification = this.notificationService.createNotification({
        token: user.notificationToken,
        title: title,
        description: body,
        data: {
          userId: user.userId,
          resourceType: PushNotificationResourceType.USER_PROFILE,
          title: title,
          description: body,
        },
      });

      if (!notification) {
        return false;
      }

      const [ticket] = await this.notificationService.sendNotifications([notification]);
      const status =
        ticket.status === 'error'
          ? PushNotificationStatus.FAILED
          : PushNotificationStatus.SUCCESS;

      if (ticket.status === 'error' && ticket.details.error === 'DeviceNotRegistered') {
        user.notificationToken = null;
        this.userRepository.update(user);
      }

      const ticketId = status === PushNotificationStatus.SUCCESS ? ticket.id : null;

      const pushNotification = PushNotification.createFromDetail(
        user.userId,
        body,
        ticketId,
        status,
        notification.data,
        PushNotificationResourceType.USER_PROFILE,
      );

      await this.pushNotificationDAO.add(pushNotification);
      return true;
    } catch (error) {
      return false;
    }
  }
  async sendNewCampaignNotifications(campaign) {
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

      const notificationsAndUsers = users.map((user) => {
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

      const pushNotificationRecords = tickets.map((ticket, index) => {
        const status =
          ticket.status === 'error'
            ? PushNotificationStatus.FAILED
            : PushNotificationStatus.SUCCESS;

        if (ticket.status === 'error' && ticket.details.error === 'DeviceNotRegistered') {
          const user = filteredUsers[index];
          user.notificationToken = null;
          this.userRepository.update(user);
        }

        const ticketId = status === PushNotificationStatus.SUCCESS ? ticket.id : null;

        return PushNotification.createFromDetail(
          filteredUsers[index].userId,
          PushNotificationMessages.replaceCampaignName(
            message.body,
            campaign.campaignName,
          ),
          ticketId,
          status,
          filteredNotifications[index] ? filteredNotifications[index].data : null,
          PushNotificationResourceType.CAMPAIGN,
        );
      });

      await this.pushNotificationDAO.addBulk(pushNotificationRecords);

      return true;
    } catch (err) {
      throw err;
    }
  }
}

export default PushNotificationService;
