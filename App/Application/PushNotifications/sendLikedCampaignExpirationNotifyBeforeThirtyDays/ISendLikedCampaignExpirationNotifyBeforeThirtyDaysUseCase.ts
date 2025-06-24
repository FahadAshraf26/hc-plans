import { UseCase } from '@application/BaseInterface/UseCase';

type SendLikedCampaignBeforeThirtyDaysNotification = {
  campaign: any;
  users: any;
};
export const ISendLikedCampaignExpirationNotifyBeforeThirtyDaysUseCaseId = Symbol.for(
  'ISendLikedCampaignExpirationNotifyBeforeThirtyDaysUseCase',
);
export interface ISendLikedCampaignExpirationNotifyBeforeThirtyDaysUseCase
  extends UseCase<SendLikedCampaignBeforeThirtyDaysNotification, boolean> {}
