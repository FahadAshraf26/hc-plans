import FetchPreTransactionsByIdDTO from './FetchPreTransactionsByIdDTO';
import UpdatePreTransactionDTO from './UpdatePreTransactionDTO';
export const IDwollaPreTransactionsServiceId = Symbol.for(
  'IDwollaPreTransactionsService',
);

export interface IDwollaPreTransactionsService {
  fetchLatestPreTransactions(): Promise<any>;
  updatePreTransactions(updatePreTransactions: UpdatePreTransactionDTO): Promise<any>;
  getPreTransactionsById(
    fetchPreTransactionByIdDTO: FetchPreTransactionsByIdDTO,
  ): Promise<any>;
  removeByUploadId(uploadId: string): Promise<any>;
}
