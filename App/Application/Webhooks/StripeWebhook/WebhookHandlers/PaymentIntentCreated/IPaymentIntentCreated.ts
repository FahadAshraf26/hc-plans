export const IPaymentIntentCreatedId = Symbol.for('IPaymentIntentCreated');

export interface IPaymentIntentCreated {
  execute(eventData: object): Promise<any>;
}
