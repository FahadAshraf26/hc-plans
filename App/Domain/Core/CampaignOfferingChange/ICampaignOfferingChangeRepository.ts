import { IBaseRepository } from '../BaseEntity/IBaseRepository';

export const ICampaignOfferingChangeRepositoryId = Symbol.for(
  'ICampaignOfferingChangeRepository',
);

export interface ICampaignOfferingChangeRepository extends IBaseRepository {}
