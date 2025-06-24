export const IPayoutFailedId = Symbol.for('IPayoutFailed');
export interface IPayoutFailed {
  execute(eventData: object): Promise<any>;
}
