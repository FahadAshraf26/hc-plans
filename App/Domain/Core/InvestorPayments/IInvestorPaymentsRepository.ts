import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';
import { InvestorPayments } from './InvestorPayments';
export const IInvestorPaymentsRepositoryId = Symbol.for('IInvestorPaymentsRepository');
export interface IInvestorPaymentsRepository extends IBaseRepository {
  getInvestorPayments(investorId: string): Promise<InvestorPayments>;
  getInvestorPaymentsWithProrate(
    investorId: string,
    campaignId: string,
    prorate: number,
    createdAt: any,
  ): Promise<Array<InvestorPayments>>
  getInvestorCampaignPayments(
    investorId: string,
    campaignId: string,
  ): Promise<InvestorPayments>;
  fetchPortfolioData(investorId: string, entityId?: string): Promise<any>;
  fetchInvestorCampaignPortfolio(investorId, campaignId,entityId): Promise<any>;
  deleteProjectionReturns(
    campaignId: string,
    lastPaymentDate: any,
  ): Promise<boolean>;
  fetchAllInvestorPaymentsByCampaignId(campaignId:string):Promise<any>
  deleteInvestorPaymentsByIds(investorPaymentsIds: string[]): Promise<any>
  fetchAllInvestorPaymentsByCampaignIds(campaignIds: string[]):Promise<any>
}
