export const ICreateNCAccountId = Symbol.for('ICreateNCAccount');
export interface ICreateNCAccount {
  createUserPartyAndAccount(user): Promise<void>;
}
