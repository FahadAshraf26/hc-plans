import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';
import PaginationData from '@domain/Utils/PaginationData';
import CampaignQA from './CampaignQA';
import PaginationOptions from '@domain/Utils/PaginationOptions';

export const ICampaignQARepositoryId = Symbol.for('ICampaignQARepository');
type campaignQAOptions = {
  paginationOptions: PaginationOptions;
  showTrashed: boolean;
};
export interface ICampaignQARepository extends IBaseRepository {
  fetchAll(options: campaignQAOptions): Promise<any>;
  fetchByCampaign(
    campaignId: string,
    paginationOptions: PaginationOptions,
    showTrashed: boolean,
  ): Promise<any>;
  fetchChildrenByCampaign(
    campaignId: string,
    paginationOptions: PaginationOptions,
    showTrashed: string,
  ): Promise<any>;
  fetchByUser(
    userId: string,
    paginationOptions: PaginationOptions,
    showTrashed: boolean,
  ): Promise<PaginationData<CampaignQA>>;
  fetchById(campaignQAId: string): Promise<CampaignQA>;
  fetchQACountByCampaign(campaignId: string): Promise<number>;
  fetchQACountByInvestor(userId: string): Promise<number>;
}
