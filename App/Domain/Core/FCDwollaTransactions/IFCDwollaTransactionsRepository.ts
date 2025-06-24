import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const IFCDwollaTransactionsRepositoryId = Symbol.for(
  'IFCDwollaTransactionsRepository',
);

export interface IFCDwollaTransactionsRepository extends IBaseRepository {}
