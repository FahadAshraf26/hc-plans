import { UseCase } from '@application/BaseInterface/UseCase';
import Campaign from '@domain/Core/Campaign/Campaign';

export const ISendNewCampaignNotificationsUseCaseId = Symbol.for(
  'ISendNewCampaignNotificationsUseCase',
);
type SendNewCampaignNotification = {
  campaign: Campaign;
};
export interface ISendNewCampaignNotificationsUseCase
  extends UseCase<SendNewCampaignNotification, boolean> {}
