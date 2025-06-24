export const IePayId = Symbol.for('IePay');

export interface IePay {
  generateClientSecret({ dto }): Promise<any>;
  updateEPayTransactions({ dto }): Promise<any>;
  cancelPaymentIntent({ dto }): Promise<any>;
}
