import PaginationData from '@domain/Utils/PaginationData';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';
import CampaignOwnerStory from './CampaignOwnerStory';

export const ICampaignOwnerStoryRepositoryId = Symbol.for(
  'ICampaignOwnerStoryRepository',
);

export interface ICampaignOwnerStoryRepository extends IBaseRepository {
  fetchAll({
    paginationOptions,
    showTrashed,
    campaignStage,
    investorId,
  }): Promise<PaginationData<CampaignOwnerStory>>;
  fetchByCampaign(
    campaignId: string,
    paginationOptions,
    showTrashed: boolean,
  ): Promise<PaginationData<any>>;
}
