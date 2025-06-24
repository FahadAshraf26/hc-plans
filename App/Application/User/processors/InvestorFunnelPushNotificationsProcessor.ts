import PushNotification from '@domain/Core/PushNotification/PushNotification';
import { PushNotificationResourceType } from '@domain/Core/ValueObjects/PushNotficationResourceType';
import { PushNotificationStatus } from '@domain/Core/ValueObjects/PushNotificationStatus';
import { inject } from 'inversify';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import {
  INotificationService,
  INotificationServiceId,
} from '@infrastructure/Service/NotificationService/INotificationService';
import {
  IPushNotificationDAO,
  IPushNotificationDAOId,
} from '@domain/Core/PushNotification/IPushNotificationDAO';

class InvestorFunnelPushNotificationsProcessor {
  private messages: any;
  private days: any;

  constructor(
    messages,
    @inject(IUserRepositoryId) private userRepository?: IUserRepository,
    @inject(INotificationServiceId) private notificationService?: INotificationService,
    @inject(IPushNotificationDAOId) private pushNotificationDAO?: IPushNotificationDAO,
  ) {
    this.messages = messages;
  }

  setDays() {
    return this.days;
  }

  async NotifyUsersKycPassedNoBankAccount(days = 3) {
    const users = await this.userRepository.fetchUserWithKycPassedAndCriteria({
      days,
      bankConnected: false,
      invested: false,
    });
    await this.sendNotificationToUsers({
      users,
      ...this.messages.addBankAccountMessage,
      resourceType: PushNotificationResourceType.ADD_BANK,
    });
    return true;
  }

  async NotifyEligibleInvestorsForFeedback(days = 3) {
    const users = await this.userRepository.fetchUserWithKycPassedAndCriteria({
      days,
      bankConnected: true,
      invested: false,
    });
    await this.sendNotificationToUsers({
      users,
      ...this.messages.sendFeedbackMessage,
      resourceType: PushNotificationResourceType.FEEDBACK,
    });
    return true;
  }

  async NotifyActiveInvestorsToRefer(days = 3) {
    const users = await this.userRepository.fetchUserWithKycPassedAndCriteria({
      days,
      bankConnected: true,
      invested: true,
    });

    await this.sendNotificationToUsers({
      users,
      ...this.messages.referAFriendMessage,
      resourceType: PushNotificationResourceType.REFER,
    });
    return true;
  }

  async sendNotificationToUsers({ users, title, body, resourceType }) {
    const userNotifications = users.map((user) => {
      return this.notificationService.createNotification({
        token: user.notificationToken,
        title,
        description: body,
        data: {
          userId: user.userId,
          title,
          body,
          resourceType,
        },
      });
    });
    const tickets = await this.notificationService.sendNotifications(userNotifications);
    const notificationRecords = tickets.map((ticket, index) => {
      const status =
        ticket.status === 'error'
          ? PushNotificationStatus.FAILED
          : PushNotificationStatus.SUCCESS;

      if (
        status === PushNotificationStatus.FAILED &&
        ticket.details.error === 'DeviceNotRegistered'
      ) {
        const user = users[index];
        user.notificationToken = null;
        this.userRepository.update(user);
      }

      const ticketId = ticket.id || null;
      return PushNotification.createFromDetail(
        users[index].userId,
        body,
        ticketId,
        status,
        userNotifications[index].data || null,
        resourceType,
      );
    });
    await this.pushNotificationDAO.addBulk(notificationRecords);
    return true;
  }
}

export default InvestorFunnelPushNotificationsProcessor;
