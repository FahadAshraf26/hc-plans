import PaginationOptions from '@domain/Utils/PaginationOptions';
import PaginationData from '@domain/Utils/PaginationData';
import CampaignNewsReport from '@domain/Core/CampaignNewsReport/CampaignNewsReport';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const ICampaignNewsReportRepositoryId = Symbol.for(
  'ICampaignNewsReportRepository',
);
type campaignNewsReportOptions = {
  paginationOptions: PaginationOptions;
  showTrashed: boolean;
};
export interface ICampaignNewsReportRepository extends IBaseRepository {
  fetchAll(
    options: campaignNewsReportOptions,
  ): Promise<PaginationData<CampaignNewsReport>>;
  fetchByCampaignNews(
    campaignNewsId?: string,
    options?: campaignNewsReportOptions,
  ): Promise<PaginationData<CampaignNewsReport>>;
  fetchCountByCampaignNews(
    campaignNewsId: string,
    showTrashed?: boolean,
  ): Promise<number>;
}
