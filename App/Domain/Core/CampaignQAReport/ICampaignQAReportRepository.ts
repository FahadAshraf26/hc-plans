import PaginationData from '@domain/Utils/PaginationData';
import CampaignQAReport from '@domain/Core/CampaignQAReport/CampaignQAReport';
import PaginationOptions from '@domain/Utils/PaginationOptions';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const ICampaignQAReportRepositoryId = Symbol.for('ICampaignQAReportRepository');
type campaignQAReportOptions = {
  paginationOptions: PaginationOptions;
  showTrashed: boolean;
};
export interface ICampaignQAReportRepository extends IBaseRepository {
  fetchAll(options: campaignQAReportOptions): Promise<PaginationData<CampaignQAReport>>;
  fetchByCampaignQA(
    campaignQAId: string,
    options: campaignQAReportOptions,
  ): Promise<PaginationData<CampaignQAReport>>;
  fetchCountByCampaignQA(campaignQAId: string, showTrashed?: boolean): Promise<number>;
}
