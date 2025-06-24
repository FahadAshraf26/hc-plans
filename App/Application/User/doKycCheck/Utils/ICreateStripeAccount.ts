export const ICreateStripeAccountId = Symbol.for('ICreateStripeAccount');
export interface ICreateStripeAccount {
  createCustomer(user): Promise<void>;
}
