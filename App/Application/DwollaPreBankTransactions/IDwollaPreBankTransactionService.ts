import FetchDwollaPreBankTransactionsByIdDTO from './FetchDwollaPreBankTransactionsByIdDTO';
import UpdateDwollaPreBankTransactionsDTO from './UpdateDwollaPreBankTransactionsDTO';

export const IDwollaPreBankTransactionsServiceId = Symbol.for(
  'IDwollaPreBankTransactionsService',
);
export interface IDwollaPreBankTransactionsService {
  fetchLatestPreBankTransactionsForWallet(): Promise<any>;
  fetchLatestPreBankTransactionsForCustody(): Promise<any>;
  updatePreBankTransactions(
    updateDwollaPreBankTransactions: UpdateDwollaPreBankTransactionsDTO,
  ): Promise<any>;
  getPreBankTransactionsById(
    fetchDwollaPreBankTransactionByIdDTO: FetchDwollaPreBankTransactionsByIdDTO,
  ): Promise<any>;
  removeByUploadId(uploadId: string): Promise<any>;
  removeByDwollaPreBankTransactionId(dwollaPreBankTransactionId: string): Promise<any>;
}
