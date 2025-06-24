export const IPaymentIntentCancelledId = Symbol.for('IPaymentIntentCancelled');

export interface IPaymentIntentCancelled {
  execute(eventData: object): Promise<any>;
}
