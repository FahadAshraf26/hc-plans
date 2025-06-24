export const IChargeRefundFailedId = Symbol.for('IChargeRefundFailed');

export interface IChargeRefundFailed {
  execute(eventData: object): Promise<any>;
}
