import CreateDwollaToBankTransactionDTO from './CreateDwollaToBankTransactionDTO';
import FetchAllDwollaToBankTransactionsByUserDTO from './FetchAllDwollaToBankTransactionsByUserDTO';
import FetchAllDwollaToBankTransactionsDTO from './FetchAllDwollaToBankTransactionsDTO';

export const IDwollaToBankTransactionsServiceId = Symbol.for(
  'IDwollaToBankTransactionsServiceId',
);
export interface IDwollaToBankTransactionsService {
  fetchAllDwollaToBankTransactionsByUser(fetchAllDwollaToBankTransactionsByUserDTO: FetchAllDwollaToBankTransactionsByUserDTO);
  addDwollaToBankTransaction(
    createDwollaToBankTransactionDTO: CreateDwollaToBankTransactionDTO,
  ): Promise<boolean>;

  fetchAllDwollaToBankTransactions(
    fetchAllDwollaToBankTransactionsDTO: FetchAllDwollaToBankTransactionsDTO,
  ): Promise<any>;
}
