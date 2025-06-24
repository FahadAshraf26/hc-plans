import CampaignNews from '@domain/Core/CampaignNews/CampaignNews';
import PaginationOptions from '@domain/Utils/PaginationOptions';
import PaginationData from '@domain/Utils/PaginationData';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const ICampaignNewsRepositoryId = Symbol.for('ICampaignNewsRepository');

type campaignNewsOptions = {
  paginationOptions: PaginationOptions;
  showTrashed?: boolean;
  query?: string;
};

export interface ICampaignNewsRepository extends IBaseRepository {
  add(campaignNews: CampaignNews): Promise<boolean>;
  fetchAll(options: campaignNewsOptions): Promise<PaginationData<any>>;
  fetchByCampaign(
    campaignId: string,
    options: campaignNewsOptions,
  ): Promise<PaginationData<CampaignNews>>;
  fetchById(campaignNewsId: string): Promise<CampaignNews>;
  update(campaignNews: CampaignNews): Promise<boolean>;
  remove(campaignNewsObj: CampaignNews, hardDelete?: boolean): Promise<boolean>;
  fetchNewsCountByCampaign(campaignId: string): Promise<number>;
}
