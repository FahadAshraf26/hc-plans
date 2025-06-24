import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';
import PaginationOptions from '@domain/Utils/PaginationOptions';
import PaginationData from '@domain/Utils/PaginationData';
import Repayments from './Repayments';

export const IRepaymentsRepositoryId = Symbol.for('IRepaymentsRepository');
type fetchAllCompletedRepaymentsOptions = {
  paginationOptions: PaginationOptions;
  investorId: string;
  campaignId: string;
  entityId: string;
};

export interface IRepaymentsRepository extends IBaseRepository {
  fetchByInvestorId(investorId: string): Promise<any>;
  fetchByCampaignId(campaignId: string): Promise<any>;
  fetchByInvestorCampaign({
    paginationOptions,
    investorId,
    campaignId,
    entityId,
  }: fetchAllCompletedRepaymentsOptions): Promise<PaginationData<Repayments>>;
  fetchByInvestorIdAndGroupByCampaign({
    paginationOptions,
    investorId,
    all,
  }): Promise<any>;
  fetchByDwollaTransferId(transferId: string): Promise<Repayments>;
  getLastRepaymentDate(campaignId: string): Promise<any>;
  fetchInvestorsRepayments(): Promise<any>;
  fetchByInvestor(investorId: string, entityId: string | null): Promise<any>;
  deleteAllRepayments(campaignIds: string[]):Promise<any>;
}
