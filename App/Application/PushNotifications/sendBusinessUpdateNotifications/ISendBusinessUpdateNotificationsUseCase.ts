import { UseCase } from '@application/BaseInterface/UseCase';

export const ISendBusinessUpdateNotificationsUseCaseId = Symbol.for(
  'ISendBusinessUpdateNotificationsUseCase',
);

type sendBusinessUpdateNotification = {
  campaignId: string;
};

export interface ISendBusinessUpdateNotificationsUseCase
  extends UseCase<sendBusinessUpdateNotification, boolean> {}
