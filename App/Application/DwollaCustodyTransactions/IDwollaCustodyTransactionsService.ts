import CreateTransferToWalletDTO from './CreateTransferToWalletDTO';
import FetchAllCompletedCustodyTransfersDTO from './FetchAllCompletedCustodyTransferDTO';
import FetchAllCustodyTransfersDTO from './FetchAllCustodyTransfersDTO';
import ReUploadFailedTransfer from './ReUploadFailedTransfers';

export const IDwollaCustodyTransactionsServiceId = Symbol.for(
  'IDwollaCustodyTransactionsService',
);

export interface IDwollaCustodyTransactionsService {
  fetchAllCustodyTransafers(
    fetchAllCustodyTransfersDTO: FetchAllCustodyTransfersDTO,
  ): Promise<any>;
  fetchAllCompletedCustodyTransafers(
    fetchAllCompletedCustodyTransfersDTO: FetchAllCompletedCustodyTransfersDTO,
  ): Promise<any>;
  createTransferToWallet(createTransferToWalletDTO: CreateTransferToWalletDTO);
  reUploadFailedTransfer(reUploadFailedTransfer: ReUploadFailedTransfer): Promise<any>;
}
