import CampaingRisk from './CampaignRisk';
import {IBaseRepository} from '@domain/Core/BaseEntity/IBaseRepository';
import PaginationData from '@domain/Utils/PaginationData';

export const ICampaignRiskRepositoryId = Symbol.for('ICampaignRiskRepository');

export interface ICampaignRiskRepository extends IBaseRepository {
    fetchAll({paginationOptions, showTrashed}): Promise<PaginationData<CampaingRisk>>;

    fetchByCampaign(
        campaignId: string,
        paginationOptions,
        options,
    ): Promise<PaginationData<CampaingRisk>>;

    removeByCampaign(campaignId: string): Promise<boolean>;
}
