export const IStripeWebhookId = Symbol.for('IStripeWebhook');
export interface IStripeWebhook {
  execute(event: object): Promise<any>;
}
