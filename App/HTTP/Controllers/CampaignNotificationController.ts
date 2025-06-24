import CampaignNotificationService from '@application/CampaignNotification/CampaignNotificationService';
import { injectable } from 'inversify';

@injectable()
class CampaignNotificationController {
  constructor(private campaignNotificationService: CampaignNotificationService) {}

  getCampaignNotificationByInvestor = async (httpRequest) => {
    const { investorId } = httpRequest.params;
    const data = await this.campaignNotificationService.getCampaignNotificationsByInvestorId(
      investorId,
    );
    return {
      body: {
        status: 'success',
        data,
      },
    };
  };

  updateNotification = async (httpRequest) => {
    const { campaignNotificationId } = httpRequest.params;
    await this.campaignNotificationService.updateNotification(campaignNotificationId);
    return {
      body: {
        status: 'success',
        message: 'Notification Viewed',
      },
    };
  };
}

export default CampaignNotificationController;
