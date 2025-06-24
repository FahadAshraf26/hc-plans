import { inject, injectable } from 'inversify';
import { ICampaignNotificationService } from './ICampaignNotificationService';
import {
  ICampaignNotificationRepository,
  ICampaignNotificationRepositoryId,
} from '@domain/Core/CampaignNotification/ICampaignNotification';

@injectable()
class CampaignNotificationService implements ICampaignNotificationService {
  constructor(
    @inject(ICampaignNotificationRepositoryId)
    private campaignNotificationRepository: ICampaignNotificationRepository,
  ) {}

  async getCampaignNotificationsByInvestorId(investorId) {
    return this.campaignNotificationRepository.fetchByInvestorId(investorId);
  }

  async updateNotification(campaignNotificationId) {
    return this.campaignNotificationRepository.updateNotification(campaignNotificationId);
  }
}

export default CampaignNotificationService;
