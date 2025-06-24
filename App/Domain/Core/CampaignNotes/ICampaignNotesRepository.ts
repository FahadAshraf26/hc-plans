import PaginationOptions from '@domain/Utils/PaginationOptions';
import PaginationData from '@domain/Utils/PaginationData';
import CampaignNotes from '@domain/Core/CampaignNotes/CampaignNotes';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const ICampaignNotesRepositoryId = Symbol.for('ICampaignNotesRepository');
type CampaignNotesOptions = {
  paginationOptions: PaginationOptions;
  showTrashed: boolean;
};
export interface ICampaignNotesRepository extends IBaseRepository {
  fetchAll({
    paginationOptions,
    showTrashed,
  }: CampaignNotesOptions): Promise<PaginationData<CampaignNotes>>;
  fetchByCampaign(
    campaignId: string,
    paginationOptions: PaginationOptions,
    showTrashed: boolean,
  ): Promise<PaginationData<CampaignNotes>>;
}
