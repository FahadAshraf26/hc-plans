import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const IDwollaPreTransactionsRepositoryId = Symbol.for(
  'IDwollaPreTransactionsRepository',
);

export interface IDwollaPreTransactionsRepository extends IBaseRepository {
  fetchAllLatestPreTransactions(): Promise<any>;
  fetchAllByUploadId(uploadId: string): Promise<any>;
  removeAllByUploadId(uploadId: string): Promise<any>;
}
