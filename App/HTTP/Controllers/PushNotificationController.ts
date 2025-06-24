import { inject, injectable } from 'inversify';
import GetUserNotificationsDTO from '@application/PushNotifications/GetUserNotificationsDTO';
import UpdateUserNotificationsDTO from '@application/PushNotifications/UpdateUserNotificationDTO';
import MarkUserNotificationAsVisitedDTO from '@application/PushNotifications/MarkUserNotificationAsVisitedDTO';
import MarkCampaignQANotificationAsVisitedDTO from '@application/PushNotifications/MarkCampaignQANotificationDTO';
import {
  IPushNotificationService,
  IPushNotificationServiceId,
} from '@application/PushNotifications/IPushNotificationService';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */
@injectable()
class PushNotificationController {
  constructor(
    @inject(IPushNotificationServiceId)
    private pushNotificationService: IPushNotificationService,
  ) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getUserNotifications = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const { page, perPage } = httpRequest.query;

    const input = new GetUserNotificationsDTO(userId, page, perPage);
    const result = await this.pushNotificationService.getUserNotifications(input);

    return { body: result };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updateUserNotification = async (httpRequest) => {
    const { userId, pushNotificationId } = httpRequest.params;
    const { body } = httpRequest;

    const input = new UpdateUserNotificationsDTO({
      ...body,
      userId,
      pushNotificationId,
    });
    await this.pushNotificationService.updateUserNotification(input);
    return {
      body: {
        status: 'success',
        message: 'user notification updated successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  setUserNotificationAsMarked = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const input = new MarkUserNotificationAsVisitedDTO(userId);

    await this.pushNotificationService.setUserNotificationAsMarked(input);
    return {
      body: {
        status: 'success',
        message: 'user notifications marked as visited',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  setCampaignQANotificationAsVisited = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const { campaignId } = httpRequest.body;
    const input = new MarkCampaignQANotificationAsVisitedDTO(userId, campaignId);

    await this.pushNotificationService.setCampaignQANotificationAsMarked(input);
    return {
      body: {
        status: 'success',
        message: 'campaign QA notifications marked as visited',
      },
    };
  };
}

export default PushNotificationController;
