import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';
import PaginationData from '@domain/Utils/PaginationData';
import CampaignDocument from '@domain/Core/CampaignDocument/CampaignDocument';
import PaginationOptions from '@domain/Utils/PaginationOptions';

export const ICampaignDocumentRepositoryId = Symbol.for('ICampaignDocumentRepository');
type campaignDocumentOptions = {
  paginationOptions: PaginationOptions;
  showTrashed?: boolean;
};
export interface ICampaignDocumentRepository extends IBaseRepository {
  fetchAll(options: campaignDocumentOptions): Promise<PaginationData<CampaignDocument>>;
  fetchByCampaign(
    campaignId,
    paginationOptions,
    options,
  ): Promise<PaginationData<CampaignDocument>>;
  fetchByCampaignAndType(campaignId: string, type: string): Promise<CampaignDocument>;
  fetchDocumentCountByCampaignType(
    campaignId: string,
    campaignType: string,
  ): Promise<any>;
}
