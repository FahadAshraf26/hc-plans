export const IAddPersonalVerifiedCustomerId = Symbol.for('IAddPersonalVerifiedCustomer');

export interface IAddPersonalVerifiedCustomer {
  execute(payload: any, user: any): Promise<any>;
}
