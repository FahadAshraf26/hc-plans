import NorthCapitalWebhook from '@domain/NorthCapitalWebhooks/NorthCapitalWebhook';
import NorthCapitalWebhookMap from '@domain/NorthCapitalWebhooks/NorthCapitalWebhookMap';

export const INorthCapitalWebhookRepositoryId = Symbol.for(
  'INorthCapitalWebhookRepository',
);
export interface INorthCapitalWebhookRepository {
  add(northCapitalWebhookEntity: NorthCapitalWebhook): Promise<boolean>;
  fetchById(webhookId: string): Promise<NorthCapitalWebhookMap>;
  update(northCapitalWebhookEntity: NorthCapitalWebhook): Promise<boolean>;
  remove(northCapitalWebhookEntity: NorthCapitalWebhook): Promise<boolean>;
}
