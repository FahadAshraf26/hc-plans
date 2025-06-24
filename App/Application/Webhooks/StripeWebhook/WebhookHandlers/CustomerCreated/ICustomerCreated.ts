export const ICustomerCreatedId = Symbol.for('ICustomerCreated');

export interface ICustomerCreated {
  execute(eventData: object): Promise<any>;
}
