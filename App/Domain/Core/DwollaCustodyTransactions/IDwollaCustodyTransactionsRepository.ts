import DwollaCustodyTransactions from '@domain/Core/DwollaCustodyTransactions/DwollaCustodyTransactions';
import { IBaseRepository } from '../BaseEntity/IBaseRepository';
export const IDwollaCustodyTransactionsRepositoryId = Symbol.for(
  'IDwollaCustodyTransactionsRepository',
);

export interface IDwollaCustodyTransactionsRepository extends IBaseRepository {
  fetchCustodyTransafers(paginationOptions, showTrashed): Promise<any>;
  fetchCompletedCustodyTransafers(paginationOptions, showTrashed): Promise<any>;
  fetchByTransferId(transferId: string): Promise<DwollaCustodyTransactions>;
  fetchAllNotCompletedRecords(): Promise<any>;
  fetchPendingNotCompletedTransfers(): Promise<any>;
  fetchPendingCompletedTransfers(): Promise<any>;
  fetchById(dwollaCustodyTransactionId: string, isCompleted: boolean): Promise<any>;
  updateByCustodyTransferId(
    dwollaCustodyTransactionId: string,
    transferId: string,
  ): Promise<void>;
  fetchByIssuerId(issuerId: string, isCompleted: boolean): Promise<any>;
  fetchDistinctIssuerIds(): Promise<any>;
  fetchTotalAmountofSuccessfulCustodyTransactionsByIssuerId(
    issuerId: string,
  ): Promise<number>;
  fetchSuccessfulByIssuerId(issuerId: string): Promise<any>;
}
