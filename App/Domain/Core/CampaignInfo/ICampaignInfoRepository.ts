import PaginationOptions from '../../Utils/PaginationOptions';
import PaginationData from '../../Utils/PaginationData';
import CampaignInfo from './CampaignInfo';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const ICampaignInfoRepositoryId = Symbol.for('ICampaignInfoRepository');

type campaignInfoOptions = {
  paginationOptions: PaginationOptions;
  showTrashed?: boolean;
};

export interface ICampaignInfoRepository extends IBaseRepository {
  fetchAll(options: campaignInfoOptions): Promise<PaginationData<CampaignInfo>>;
  fetchByCampaign(campaignId: string, showTrashed: boolean): Promise<CampaignInfo>;
  fetchById(campaignInfoId: string): Promise<CampaignInfo>;
}
