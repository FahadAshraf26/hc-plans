import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const IEntityAccreditationRepositoryId = Symbol.for(
  'IEntityAccreditationRepository',
);

export interface IEntityAccreditationRepository extends IBaseRepository {}
