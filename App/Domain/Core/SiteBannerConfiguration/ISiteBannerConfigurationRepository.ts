import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const ISiteBannerConfigurationRepositoryId = Symbol.for(
  'ISiteBannerConfigurationRepository',
);

export interface ISiteBannerConfigurationRepository extends IBaseRepository {
  fetchLatestRecord(): Promise<any>;
}
