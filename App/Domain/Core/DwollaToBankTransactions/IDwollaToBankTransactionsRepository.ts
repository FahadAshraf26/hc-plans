import DwollaToBankTransactions from '@domain/Core/DwollaToBankTransactions/DwollaToBankTransactions';
import PaginationOptions from '@domain/Utils/PaginationOptions';

export const IDwollaToBankTransactionsRepositoryId = Symbol.for(
  'IDwollaToBankTransactionsRepository',
);

type fetchAllOptions = {
  paginationOptions: PaginationOptions;
  query: string;
};
export interface IDwollaToBankTransactionsRepository {
  fetchAllUserTransferRecords(options): Promise<any>;
  createTransafer(dwollaToBankTransactions: DwollaToBankTransactions): Promise<boolean>;
  getByTransactionId(transactionId: string): Promise<DwollaToBankTransactions>;
  updateTransfer(dwollaToBankTransactions): Promise<boolean>;
  fetchAllTransferRecords(options: fetchAllOptions): Promise<any>;
  fetchOneByCustomCritera(options: any): Promise<any>;
}
