import PaginationOptions from '@domain/Utils/PaginationOptions';
import PaginationData from '@domain/Utils/PaginationData';
import CampaignRoughBudget from '@domain/Core/CampaignRoughBudget/CampaignRoughBudget';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const ICampaignRoughBudgetRepositoryId = Symbol.for(
  'ICampaignRoughBudgetRepository',
);
type RoughBudgetOptions = {
  paginationOptions: PaginationOptions;
  showTrashed: boolean;
};
export interface ICampaignRoughBudgetRepository extends IBaseRepository {
  fetchAll({
    paginationOptions,
    showTrashed,
  }: RoughBudgetOptions): Promise<PaginationData<CampaignRoughBudget>>;
  fetchByCampaign(
    campaignId: string,
    showTrashed?: boolean,
  ): Promise<CampaignRoughBudget>;
}
