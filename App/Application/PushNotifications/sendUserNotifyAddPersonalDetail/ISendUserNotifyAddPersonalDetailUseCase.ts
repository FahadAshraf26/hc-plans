import { UseCase } from '@application/BaseInterface/UseCase';

export const ISendUserNotifyAddPersonalDetailUseCaseId = Symbol.for(
  'ISendUserNotifyAddPersonalDetailUseCase',
);
type sendNotifyPersonalDetail = {
  users: any;
};
export interface ISendUserNotifyAddPersonalDetailUseCase
  extends UseCase<sendNotifyPersonalDetail, boolean> {}
