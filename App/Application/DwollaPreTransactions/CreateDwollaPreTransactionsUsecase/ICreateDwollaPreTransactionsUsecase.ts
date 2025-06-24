import CreateDwollaPreTransactionDTO from '@application/DwollaPreTransactions/CreateDwollaPreTransactionsUsecase/CreateDwollaPreTransactionsDTO';
export const ICreateDwollaPreTransactionsUsecaseId = Symbol.for(
  'ICreateDwollaPreTransactionsUsecase',
);

export interface ICreateDwollaPreTransactionsUsecase {
  execute(createDwollaPreTransactionDTO: CreateDwollaPreTransactionDTO): Promise<any>;
}
