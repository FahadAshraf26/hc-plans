import models from '../Model';
import { IPushNotificationDAO } from '@domain/Core/PushNotification/IPushNotificationDAO';
import { injectable } from 'inversify';
import PushNotification from '@domain/Core/PushNotification/PushNotification';
import { PushNotificationStatus } from '@domain/Core/ValueObjects/PushNotificationStatus';
import { PushNotificationResourceType } from '@domain/Core/ValueObjects/PushNotficationResourceType';
import BaseRepository from './BaseRepository';
const { PushNotificationModel, Sequelize } = models;
const { Op, literal } = Sequelize;

@injectable()
class PushNotificationDAO extends BaseRepository implements IPushNotificationDAO {
  constructor() {
    super(PushNotificationModel, 'pushNotificationId', PushNotification);
  }

  /**
   * fetchById(pushNotificationId) fetch pushNotification By Id
   * @param {string} userId
   * @param paginationOptions
   * @param showFailed
   * @returns PushNotification
   */
  async fetchByUserId(userId, { paginationOptions, showFailed = false }) {
    return await super.fetchAll({
      paginationOptions,
      order: [['createdAt', 'desc']],
      whereConditions: showFailed
        ? { userId }
        : { userId, status: PushNotificationStatus.SUCCESS },
    });
  }

  async setUserNotificationAsVisited(userId) {
    try {
      const pushNotification = await PushNotificationModel.update(
        { visited: true },
        {
          where: { userId, visited: false },
        },
      );

      return pushNotification;
    } catch (error) {
      throw Error(error);
    }
  }

  async setCampaignQANotificationAsVisited(userId, campaignId) {
    try {
      const pushNotification = await PushNotificationModel.update(
        { visited: true },
        {
          where: {
            userId,
            visited: false,
            [Op.and]: literal(`data->"$.campaignId"='${campaignId}'`),
            resourceType: PushNotificationResourceType.NEW_CAMPAIGN_QA,
          },
        },
      );

      return pushNotification;
    } catch (error) {
      throw Error(error);
    }
  }
}

export default PushNotificationDAO;
