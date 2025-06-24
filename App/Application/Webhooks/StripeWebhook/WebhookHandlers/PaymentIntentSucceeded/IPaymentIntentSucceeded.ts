export const IPaymentIntentSucceededId = Symbol.for('IPaymentIntentSucceeded');
export interface IPaymentIntentSucceeded {
  execute(eventData: object): Promise<any>;
}
