import { UseCase } from '@application/BaseInterface/UseCase';
export const IHandleUSAEpayWebhookUseCaseId = Symbol.for('IHandleUSAEpayWebhookUseCase');
export interface IHandleUSAEpayWebhookUseCase extends UseCase<any, void> {}
