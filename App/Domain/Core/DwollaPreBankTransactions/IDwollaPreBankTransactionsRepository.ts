import { IBaseRepository } from './../BaseEntity/IBaseRepository';
export const IDwollaPreBankTransactionsRepositoryId = Symbol.for(
  'IDwollaPreBankTransactionsRepository',
);
export interface IDwollaPreBankTransactionsRepository extends IBaseRepository {
  fetchAllLatestPreBankTransactionsForWallet(): Promise<any>;
  fetchAllLatestPreBankTransactionsForCustody(): Promise<any>;
  fetchAllByUploadId(uploadId: string): Promise<any>;
  removeAllByUploadId(uploadId: string): Promise<any>;
  removeAllByDwollaPreBankTransactionId(dwollaPreBankTransactionId: string): Promise<any>;
}
