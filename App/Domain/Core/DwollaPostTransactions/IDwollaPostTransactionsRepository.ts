import DwollaPostTransactions from '@domain/Core/DwollaPostTransactions/DwollaPostTransactions';
import { IBaseRepository } from './../BaseEntity/IBaseRepository';
export const IDwollaPostTransactionsRepositoryId = Symbol.for(
  'IDwollaPostTransactionsRepository',
);

export interface IDwollaPostTransactionsRepository extends IBaseRepository {
  fetchPostTransafers(paginationOptions, showTrashed): Promise<any>;
  fetchByTransferId(transferId: string): Promise<DwollaPostTransactions>;
}
