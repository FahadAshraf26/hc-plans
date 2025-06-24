import { inject, injectable } from 'inversify';
import {
  IPushNotificationService,
  IPushNotificationServiceId,
} from '@application/PushNotifications/IPushNotificationService';
import Campaign from '@domain/Core/Campaign/Campaign';

@injectable()
class ComingSoonNotificationService {
  constructor(
    private campaign: Campaign,
    @inject(IPushNotificationServiceId)
    private pushNotificationService?: IPushNotificationService,
  ) {
    this.campaign = campaign;
  }

  async execute() {
    await this.pushNotificationService.sendNewCampaignNotifications(this.campaign);
  }
}

export default ComingSoonNotificationService;
