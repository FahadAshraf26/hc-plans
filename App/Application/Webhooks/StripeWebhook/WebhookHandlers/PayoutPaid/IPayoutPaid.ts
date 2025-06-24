export const IPayoutPaidId = Symbol.for('IPayoutPaid');
export interface IPayoutPaid {
  execute(eventData: object): Promise<any>;
}
