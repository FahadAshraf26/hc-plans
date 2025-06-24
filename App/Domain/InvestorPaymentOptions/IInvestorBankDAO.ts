import InvestorBank from './InvestorBank';

export const IInvestorBankDAOId = Symbol.for('IInvestorBankDAO');

export interface IInvestorBankDAO {
  add(investorBank: InvestorBank): Promise<void>;
  fetchByPaymentOptionsId(paymentOptionId): Promise<boolean | InvestorBank>;
  fetchById(investorBankId: string): Promise<boolean | InvestorBank>;
  remove(investorBank: InvestorBank, hardDelete: boolean): Promise<void>;
  update(bank: InvestorBank): Promise<boolean>;
  upsert(bankEntity: InvestorBank): Promise<boolean | void>;
}
