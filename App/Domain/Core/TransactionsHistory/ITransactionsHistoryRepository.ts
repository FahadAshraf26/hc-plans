import { IBaseRepository } from './../BaseEntity/IBaseRepository';

export const ITransactionsHistoryRepositoryId = Symbol.for(
  'ITransactionsHistoryRepository',
);
export interface ITransactionsHistoryRepository extends IBaseRepository {
  getAllInvestorTransafers(userId: string): Promise<any>;
}
