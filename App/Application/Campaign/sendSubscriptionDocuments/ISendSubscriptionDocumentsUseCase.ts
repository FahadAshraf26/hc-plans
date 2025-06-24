import SendSubscritionDocumentDTO from './SendSubscriptionDocumentsDTO';

export const ISendSubscriptionDocumentsUseCaseId = Symbol.for('ISendSubscriptionDocumentsUseCase');

export interface ISendSubscriptionDocumentsUseCase {
  execute(dto: SendSubscritionDocumentDTO): Promise<any>;
}
