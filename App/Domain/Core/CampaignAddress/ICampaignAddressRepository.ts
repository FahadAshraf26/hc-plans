import { IBaseRepository } from '../BaseEntity/IBaseRepository';

export const ICampaignAddressRepositoryId = Symbol.for('ICampaignAddressRepository');

export interface ICampaignAddressRepository extends IBaseRepository {}
