import PaginationOptions from '@domain/Utils/PaginationOptions';
import PaginationData from '@domain/Utils/PaginationData';
import Charge from '@domain/Core/Charge/Charge';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const IChargeRepositoryId = Symbol.for('IChargeRepository');
type chargeOptions = {
  paginationOptions: PaginationOptions;
  showTrashed: boolean;
};
export interface IChargeRepository extends IBaseRepository {
  fetchAll(options: chargeOptions): Promise<PaginationData<Charge>>;
  fetchByDwollaChargeId(dwollaChargeId: string): Promise<Charge>;
  fetchByReferenceNumber(referenceNumber: string): Promise<Charge>;
  refundCampaignCharges(campaignId: string): Promise<boolean>;
}
