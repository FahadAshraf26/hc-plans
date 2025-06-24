import InvestorCard from './InvestorCard';

export const IInvestorCardDAOId = Symbol.for('IInvestorCardDAO');

export interface IInvestorCardDAO {
  add(investorCard: InvestorCard): Promise<void>;
  fetchByPaymentOptionsId(paymentOptionId: string): Promise<boolean | InvestorCard>;
  fetchById(investorCardId: string): Promise<boolean | InvestorCard>;
  remove(investorCard: InvestorCard, hardDelete: boolean): Promise<void>;
}
