import CampaignNotification from '@domain/Core/CampaignNotification/CampaignNotification';

export const ICampaignNotificationServiceId = Symbol.for('ICampaignNotificationService');
export interface ICampaignNotificationService {
  getCampaignNotificationsByInvestorId(
    investorId: string,
  ): Promise<Array<CampaignNotification>>;
  updateNotification(campaignNotificationId: string): Promise<boolean>;
}
