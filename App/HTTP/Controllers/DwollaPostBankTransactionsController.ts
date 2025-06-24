import {
  ICreatePostBankTransactionsUseCaseId,
  ICreatePostBankTransactionsUseCase,
} from '@application/DwollaPostBankTransactions/CreatePostBankTransactionsUseCase/ICreatePostBankTransactionsUseCase';
import CreatePostBankTransactionsUseCaseDTO from '@application/DwollaPostBankTransactions/CreatePostBankTransactionsUseCase/CreatePostBankTransactionsUseCaseDTO';
import {
  IDwollaPostBankTransactionsServiceId,
  IDwollaPostBankTransactionsService,
} from '@application/DwollaPostBankTransactions/IDwollaPostBankTransactionsService';
import { inject, injectable } from 'inversify';
import FetchAllPostBankTransfersDTO from '@application/DwollaPostBankTransactions/FetchAllPostBankTransfersDTO';
import FetchByTransferIdDTO from '@application/DwollaPostBankTransactions/FetchByTransferIdDTO';

@injectable()
class DwollaPostBankTransactionController {
  constructor(
    @inject(IDwollaPostBankTransactionsServiceId)
    private dwollaPostBankTransactionsService: IDwollaPostBankTransactionsService,
    @inject(ICreatePostBankTransactionsUseCaseId)
    private createPostBankTransactionsUseCase: ICreatePostBankTransactionsUseCase,
  ) {}

  createPostBankTransfer = async (httpRequest) => {
    const { uploadId } = httpRequest.params;
    const input = new CreatePostBankTransactionsUseCaseDTO(uploadId);
    await this.createPostBankTransactionsUseCase.execute(input);
    return {
      body: {
        status: 'success',
        message: 'Transfer Intitiated',
      },
    };
  };

  getAllPostBankTransfers = async (httpRequest) => {
    const { page, perPage, showTrashed, query } = httpRequest.query;
    const input = new FetchAllPostBankTransfersDTO(page, perPage, showTrashed, query);
    const response = await this.dwollaPostBankTransactionsService.fetchAllPostBankTransafers(
      input,
    );
    return {
      body: response,
    };
  };

  getByTransferId = async (httpRequest) => {
    const { dwollaTransferId } = httpRequest.params;
    const input = new FetchByTransferIdDTO(dwollaTransferId);
    const data = await this.dwollaPostBankTransactionsService.fetchByDwollaTransferId(
      input,
    );
    return {
      body: {
        status: 'success',
        data,
      },
    };
  };
}

export default DwollaPostBankTransactionController;
