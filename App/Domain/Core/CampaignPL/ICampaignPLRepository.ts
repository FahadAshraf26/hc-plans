import CampaignPL from '@domain/Core/CampaignPL/CampaignPL';
import PaginationOptions from '@domain/Utils/PaginationOptions';
import PaginationData from '@domain/Utils/PaginationData';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const ICampaignPLRepositoryId = Symbol.for('ICampaignPLRepository');
type CampaignPLOptions = {
  paginationOptions: PaginationOptions;
  showTrashed: boolean;
};
export interface ICampaignPLRepository extends IBaseRepository {
  fetchAll({
    paginationOptions,
    showTrashed,
  }: CampaignPLOptions): Promise<PaginationData<CampaignPL>>;
  fetchByCampaign(campaignId: string, showTrashed: boolean): Promise<CampaignPL>;
}
