import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';
import InvestorPayment from '@domain/Core/InvestorPayment/InvestorPayment';

export const IInvestorPaymentRepositoryId = Symbol.for('IInvestorPaymentRepository');

export interface IInvestorPaymentRepository extends IBaseRepository {
  add(investorPayment: InvestorPayment): Promise<boolean>;
}
