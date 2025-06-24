export const ITransferFundsToWalletUseCaseId = Symbol.for(
  'ITransferFundsToWalletUseCase',
);

export interface ITransferFundsToWalletUseCase {
  execute(): Promise<any>;
}
