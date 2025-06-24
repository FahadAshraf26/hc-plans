import { UseCase } from '@application/BaseInterface/UseCase';
import Campaign from '@domain/Core/Campaign/Campaign';
type SendLikedCampaignExpireBeforeOneDay = {
  campaign: Campaign;
  users: any;
};
export const ISendLikedCampaignExpirationNotifyBeforeOneDayUseCaseId = Symbol.for(
  'ISendLikedCampaignExpirationNotifyBeforeOneDayUseCase',
);
export interface ISendLikedCampaignExpirationNotifyBeforeOneDayUseCase
  extends UseCase<SendLikedCampaignExpireBeforeOneDay, boolean> {}
