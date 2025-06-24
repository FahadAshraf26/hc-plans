import { UseCase } from '@application/BaseInterface/UseCase';
export const IHandleNorthCapitalWebhookUseCaseId = Symbol.for(
  'IHandleNorthCapitalWebhookUseCase',
);
export interface IHandleNorthCapitalWebhookUseCase extends UseCase<any, void> {}
