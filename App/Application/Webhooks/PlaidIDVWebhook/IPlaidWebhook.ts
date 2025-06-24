import PlaidIDVWebhookDTO from './PlaidIDVWebhookDTO';

export const IPlaidWebhookId = Symbol.for('IPlaidWebhook');

export interface IPlaidWebhook {
  execute(webhookDTO: PlaidIDVWebhookDTO): Promise<void>;
}
