import TransferFundsToCustodyUseCaseDTO from './TransferFundToCustodyUsecaseDTO';

export const ITransferFundsToCustodyUseCaseId = Symbol.for(
  'ITransferFundsToCustodyUseCase',
);

export interface ITransferFundsToCustodyUseCase {
  execute(transferFundsToCustodyUsecaseDTO: TransferFundsToCustodyUseCaseDTO);
}
