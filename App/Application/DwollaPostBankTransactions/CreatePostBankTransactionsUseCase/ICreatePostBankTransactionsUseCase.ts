import CreatePostBankTransactionsUseCaseDTO from '@application/DwollaPostBankTransactions/CreatePostBankTransactionsUseCase/CreatePostBankTransactionsUseCaseDTO';
export const ICreatePostBankTransactionsUseCaseId = Symbol.for(
  'ICreatePostBankTransactionsUseCase',
);

export interface ICreatePostBankTransactionsUseCase {
  execute(createPostBankTransactionsUseCaseDTO: CreatePostBankTransactionsUseCaseDTO);
}
