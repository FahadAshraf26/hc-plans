export const IUSAEpayEventHandlerFactoryId = Symbol.for('IUSAEpayEventHandlerFactory');

export interface IUSAEpayEventHandlerFactory {
  createHandlerFromTopic(webhookType: any): any;
}
