import { IBaseRepository } from '../BaseEntity/IBaseRepository';
import CampaignNotification from '@domain/Core/CampaignNotification/CampaignNotification';

export const ICampaignNotificationRepositoryId = Symbol.for(
  'ICampaignNotificationRepository',
);

export interface ICampaignNotificationRepository extends IBaseRepository {
  fetchByInvestorId(investorId: string): Promise<Array<CampaignNotification>>;
  updateNotification(campaignNotificationId: string): Promise<boolean>;
}
