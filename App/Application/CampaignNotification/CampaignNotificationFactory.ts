import { CampaignStage } from '@domain/Core/ValueObjects/CampaignStage';
import ComingSoonNotificationService from './ComingSoonNotificationService';
import FundraisingNotificationService from './FundraisingNotificationService';
import FundedNotificationService from './FundedNotificationService';
import MaterialChangeNotificationService from './MaterialChangeNotificationService';
import NotFundedNotificationService from './NotFundedNotificationService';
import PendingRefundsNotificationService from './PendingRefundsNotificationService';

class CampaignNotificationFactory {
  static createFromCampaign(campaign) {
    switch (campaign.campaignStage) {
      case CampaignStage.COMING_SOON:
        return new ComingSoonNotificationService(campaign);
      case CampaignStage.FUNDRAISING:
        return new FundraisingNotificationService(campaign);
      case CampaignStage.FUNDED:
        return new FundedNotificationService(campaign);
      case CampaignStage.PENDING_REFUNDS:
        return new PendingRefundsNotificationService(campaign);
      case CampaignStage.NOT_FUNDED:
        return new NotFundedNotificationService(campaign);
      case CampaignStage.MATERIAL_CHANGE:
        return new MaterialChangeNotificationService(campaign);
      default:
        return null;
    }
  }
}

export default CampaignNotificationFactory;
