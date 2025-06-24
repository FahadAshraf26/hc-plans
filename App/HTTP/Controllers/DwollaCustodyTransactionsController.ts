import CreateTransferToWalletDTO from '@application/DwollaCustodyTransactions/CreateTransferToWalletDTO';
import FetchAllCompletedCustodyTransfersDTO from '@application/DwollaCustodyTransactions/FetchAllCompletedCustodyTransferDTO';
import FetchAllCustodyTransfersDTO from '@application/DwollaCustodyTransactions/FetchAllCustodyTransfersDTO';
import {
  IDwollaCustodyTransactionsService,
  IDwollaCustodyTransactionsServiceId,
} from '@application/DwollaCustodyTransactions/IDwollaCustodyTransactionsService';
import ReUploadFailedTransfer from '@application/DwollaCustodyTransactions/ReUploadFailedTransfers';
import {
  ITransferFundsToCustodyUseCase,
  ITransferFundsToCustodyUseCaseId,
} from '@application/DwollaCustodyTransactions/TransferFundsToCustody/ITransferFundsToCustodyUsecase';
import TransferFundsToCustodyUseCaseDTO from '@application/DwollaCustodyTransactions/TransferFundsToCustody/TransferFundToCustodyUsecaseDTO';
import {
  ITransferFundsToWalletUseCase,
  ITransferFundsToWalletUseCaseId,
} from '@application/DwollaCustodyTransactions/TransferFundsToWallets/ITransferFundsToWalletUsecase';
import { inject, injectable } from 'inversify';

@injectable()
class DwollaCustodyTransactionsController {
  constructor(
    @inject(ITransferFundsToCustodyUseCaseId)
    private transferFundsToCustody: ITransferFundsToCustodyUseCase,
    @inject(IDwollaCustodyTransactionsServiceId)
    private dwollaCustodyTransactionsService: IDwollaCustodyTransactionsService,
    @inject(ITransferFundsToWalletUseCaseId)
    private transferFundsToWallet: ITransferFundsToWalletUseCase,
  ) {}

  transferFundsToCustodyAccount = async (httpRequest) => {
    const { uploadId } = httpRequest.params;
    const input = new TransferFundsToCustodyUseCaseDTO(uploadId);
    await this.transferFundsToCustody.execute(input);
    return {
      body: {
        status: 'success',
        message: 'Transfer Intitiated',
      },
    };
  };

  transferFundsToBusinessWallet = async (httpRequest) => {
    await this.transferFundsToWallet.execute();
    return {
      body: {
        status: 'success',
        message: 'Transfer Initiated',
      },
    };
  };

  transferFundsToBusinessWalletByIssuerId = async (httpRequest) => {
    const { issuerId } = httpRequest.params;
    const input = new CreateTransferToWalletDTO(issuerId);
    await this.dwollaCustodyTransactionsService.createTransferToWallet(input);
    return {
      body: {
        status: 'success',
        message: 'Transfer Initiated',
      },
    };
  };

  getAllCustodyTransfers = async (httpRequest) => {
    const { page, perPage, showTrashed, query } = httpRequest.query;
    const input = new FetchAllCustodyTransfersDTO(page, perPage, showTrashed, query);
    const response = await this.dwollaCustodyTransactionsService.fetchAllCustodyTransafers(
      input,
    );
    return {
      body: response,
    };
  };

  getAllCompletedCustodyTransfers = async (httpRequest) => {
    const { page, perPage, showTrashed, query } = httpRequest.query;
    const input = new FetchAllCompletedCustodyTransfersDTO(
      page,
      perPage,
      showTrashed,
      query,
    );
    const response = await this.dwollaCustodyTransactionsService.fetchAllCompletedCustodyTransafers(
      input,
    );
    return {
      body: response,
    };
  };

  reUploadFailedTransfers = async (httpRequest) => {
    const { dwollaCustodyTransactionId } = httpRequest.params;
    const input = new ReUploadFailedTransfer(dwollaCustodyTransactionId);
    await this.dwollaCustodyTransactionsService.reUploadFailedTransfer(input);
    return {
      body: {
        status: 'success',
        message: 'Transaction has been uploaded to for Bank to Custody Transfers',
      },
    };
  };
}

export default DwollaCustodyTransactionsController;
