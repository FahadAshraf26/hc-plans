export const IChargeSuccessId = Symbol.for('IChargeSuccess');
export interface IChargeSuccess {
  execute(eventData: object): Promise<any>;
}
