import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const IEntityCampaignFundRepositoryId = Symbol.for(
  'IEntityCampaignFundRepository',
);

export interface IEntityCampaignFundRepository extends IBaseRepository {}

