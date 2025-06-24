import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const IEntityIntermediaryRepositoryId = Symbol.for(
  'IEntityIntermediaryRepository',
);

export interface IEntityIntermediaryRepository extends IBaseRepository {
  fetchEntitesByUserId(userId: string): Promise<any>;
  upsert(values: any, condition: any): Promise<any>;
  fetchByIntermediaryName(intermediaryName: string): Promise<any>
  fetchByIssuerId(issuerId: string): Promise<any>;
}

