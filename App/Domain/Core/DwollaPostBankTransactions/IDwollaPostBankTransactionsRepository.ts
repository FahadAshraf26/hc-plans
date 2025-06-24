import DwollaPostBankTransactions from '@domain/Core/DwollaPostBankTransactions/DwollaPostBankTransactions';
import { IBaseRepository } from '../BaseEntity/IBaseRepository';
export const IDwollaPostBankTransactionsRepositoryId = Symbol.for(
  'IDwollaPostBankTransactionsRepository',
);

export interface IDwollaPostBankTransactionsRepository extends IBaseRepository {
  fetchPostBankTransafers(paginationOptions, showTrashed): Promise<any>;
  fetchByTransferId(transferId: string): Promise<DwollaPostBankTransactions>;
}
