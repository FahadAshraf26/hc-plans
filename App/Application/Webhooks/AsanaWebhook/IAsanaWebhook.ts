export const IAsanaWebhookId = Symbol.for('IAsanaWebhook');

export interface IAsanaWebhook {
  handleAsanaWebhook(status: string, debitAuthorizationID: string): Promise<any>;
}
