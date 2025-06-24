import CampaignNotification from '@domain/Core/CampaignNotification/CampaignNotification';
import { ICampaignNotificationRepository } from '@domain/Core/CampaignNotification/ICampaignNotification';
import Model from '@infrastructure/Model';
import { injectable } from 'inversify';
import BaseRepository from './BaseRepository';

const { CampaignNotificationModel, CampaignModel, CampaignNewsModel } = Model;

@injectable()
class CampaignNotificationRepository extends BaseRepository
  implements ICampaignNotificationRepository {
  constructor() {
    super(CampaignNotificationModel, 'campaignNotificationId', CampaignNotification);
  }

  async fetchByInvestorId(investorId) {
    const campaignNotifications = await CampaignNotificationModel.findAll({
      where: {
        investorId,
      },
      include: [
        {
          model: CampaignModel,
          as: 'campaign',
        },
        {
          model: CampaignNewsModel,
          as: 'campaignNews',
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return campaignNotifications.map((campaignNotificationObj) => {
      const campaignNotification = CampaignNotification.createFromObject(
        campaignNotificationObj,
      );
      if (campaignNotificationObj.campaign) {
        campaignNotification.setCampaign(campaignNotificationObj.campaign);
      }

      if (campaignNotificationObj.campaignNews) {
        campaignNotification.setCampaignNews(campaignNotificationObj.campaignNews);
      }

      return campaignNotification;
    });
  }

  async updateNotification(campaignNotificationId) {
    return CampaignNotificationModel.update(
      { isSeen: true },
      {
        where: {
          campaignNotificationId,
        },
      },
    );
  }
}

export default CampaignNotificationRepository;
