export const IPaymentProcessingId = Symbol.for('IPaymentProcessing');
export interface IPaymentProcessing {
  execute(eventData: object): Promise<any>;
}
