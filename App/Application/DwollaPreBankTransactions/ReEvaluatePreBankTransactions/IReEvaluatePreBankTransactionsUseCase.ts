import ReEvaluatePreBankTransactionsDTO from './ReEvaluatePreBankTransactionsDTO';

export const IReEvaluatePreBankTransactionsUseCaseId = Symbol.for(
  'IReEvaluatePreBankTransactionsUseCase',
);
export interface IReEvaluatePreBankTransactionsUseCase {
  execute(
    reEvaluatePreBankTransactionsDTO: ReEvaluatePreBankTransactionsDTO,
  ): Promise<any>;
}
