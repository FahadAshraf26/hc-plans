import CreateDwollaPreBankTransactionsDTO from './CreateDwollaPreBankTransactionsDTO';
export const ICreateDwollaPreBankTransactionsUsecaseId = Symbol.for(
  'ICreateDwollaPreBankTransactionsUsecase',
);

export interface ICreateDwollaPreBankTransactionsUsecase {
  execute(
    createDwollaPreBankTransactionsDTO: CreateDwollaPreBankTransactionsDTO,
  ): Promise<any>;
}
