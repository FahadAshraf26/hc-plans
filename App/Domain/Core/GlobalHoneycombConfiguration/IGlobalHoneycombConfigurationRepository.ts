import {IBaseRepository} from '@domain/Core/BaseEntity/IBaseRepository';

export const IGlobalHoneycombConfigurationRepositoryId = Symbol.for(
    'IGlobalHoneycombConfigurationRepository',
);

export interface IGlobalHoneycombConfigurationRepository extends IBaseRepository {
    fetchLatestRecord(): Promise<any>
}
