import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const ICampaignMediaRepositoryId = Symbol.for('ICampaignMediaRepository');

export interface ICampaignMediaRepository extends IBaseRepository {
  fetchAll({ paginationOptions, showTrashed }): Promise<any>;
  fetchByCampaign(
    campaignId: string,
    paginationOptions,
    showTrashed: boolean,
  ): Promise<any>;
  fetchAllByCampaignId(campaignId: string): Promise<any>;
}
