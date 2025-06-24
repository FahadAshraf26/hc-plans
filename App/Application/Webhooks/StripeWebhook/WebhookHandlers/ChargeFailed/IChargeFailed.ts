export const IChargeFailedId = Symbol.for('IChargeFailed');
export interface IChargeFailed {
  execute(eventData: object): Promise<any>;
}
