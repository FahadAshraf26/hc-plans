import CreateFCDwollaTransactionsDTO from "./CreateFCDwollaTransactionsDTO";
import FetchAllFCDwollaTransactionsDTO from "./FetchAllFCDwollaTransactionsDTO";

export const IFCDwollaTransactionsServiceId = Symbol.for(
    'IFCDwollaTransactionsServiceId',
  );

export interface IFCDwollaTransactionsService {
    createTransactions(dto: CreateFCDwollaTransactionsDTO): Promise<any>;
    fetchAllTransactions(dto: FetchAllFCDwollaTransactionsDTO): Promise<any>;
}