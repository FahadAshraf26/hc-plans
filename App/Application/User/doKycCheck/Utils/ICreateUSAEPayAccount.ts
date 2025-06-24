export const ICreateUSAEPayAccountId = Symbol.for('ICreateUSAEPayAccount');
export interface ICreateUSAEPayAccount {
  createFirstCitizenBankCustomer(user): Promise<void>;
  createThreadBankCustomer(user): Promise<void>;
}
