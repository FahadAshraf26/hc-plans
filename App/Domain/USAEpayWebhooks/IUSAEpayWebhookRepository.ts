import USAEpayWebhook from '@domain/USAEpayWebhooks/USAEpayWebhook';
import USAEpayWebhookMap from '@domain/USAEpayWebhooks/USAEpayWebhookMap';

export const IUSAEpayWebhookRepositoryId = Symbol.for('IUSAEpayWebhookRepository');
export interface IUSAEpayWebhookRepository {
  add(northCapitalWebhookEntity: USAEpayWebhook): Promise<boolean>;
  fetchById(webhookId: string): Promise<USAEpayWebhookMap>;
  update(northCapitalWebhookEntity: USAEpayWebhook): Promise<boolean>;
  remove(northCapitalWebhookEntity: USAEpayWebhook): Promise<boolean>;
}
