import ReEvaluatePreTransactionsDTO from './ReEvaluatePreTransactionsDTO';
export const IReEvaluatePreTransactionsUseCaseId = Symbol(
  'IReEvaluatePreTransactionsUseCase',
);
export interface IReEvaluatePreTransactionsUseCase {
  reEvaluatePreTransactions(
    reEvaluatePreTransactionsDTO: ReEvaluatePreTransactionsDTO,
  ): Promise<any>;
}
