import PaginationData from '@domain/Utils/PaginationData';
import InvestorPaymentOptions from './InvestorPaymentOptions';

export const IInvestorPaymentOptionsRepositoryId = Symbol.for(
  'IInvestorPaymentOptionsRepository',
);

export interface IInvestorPaymentOptionsRepository {
  add(investorPaymentOption: InvestorPaymentOptions): Promise<boolean>;
  fetchById(investorPaymentOptionsId: string): Promise<InvestorPaymentOptions>;
  fetchAllByInvestor({
    investorId,
    paginationOptions,
    showTrashed,
  }): Promise<PaginationData<any>>;
  fetchInvestorCard(
    investorId: string,
    isStripeCard: boolean,
  ): Promise<InvestorPaymentOptions>;
  fetchInvestorBank(investorId: string): Promise<InvestorPaymentOptions>;
  remove(paymentOption, hardDelete?: boolean): Promise<void>;
  updateBank(paymentOption): Promise<boolean>;
}
