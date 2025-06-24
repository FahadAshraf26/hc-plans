import CampaignEscrowBank from '@domain/Core/CampaignEscrowBank/CampaignEscrowBank';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const ICampaignEscrowBankRepositoryId = 'ICampaignEscrowBankRepository';
export interface ICampaignEscrowBankRepository extends IBaseRepository {
  fetchByCampaignId(campaignId): Promise<CampaignEscrowBank>;
  update(campaignEscrowBank): Promise<boolean>;
  fetchByDwollaSourceId(dwollaSourceId): Promise<CampaignEscrowBank>;
}
