export const IPaymentIntentFailureId = Symbol.for('IPaymentIntentFailure');

export interface IPaymentIntentFailure {
  execute(eventData: object): Promise<any>;
}
