import CreatePostTransactionsUseCaseDTO from '@application/DwollaPostTransactions/CreatePostTransactionsUseCase/CreatePostTransactionsUseCaseDTO';
export const ICreatePostTransactionsUseCaseId = Symbol.for(
  'ICreatePostTransactionsUseCase',
);

export interface ICreatePostTransactionsUseCase {
  execute(createPostTransactionsUseCaseDTO: CreatePostTransactionsUseCaseDTO);
}
