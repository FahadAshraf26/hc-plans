export const IChargeRefundId = Symbol.for('IChargeRefund');
export interface IChargeRefund {
  execute(eventData: object): Promise<any>;
}
