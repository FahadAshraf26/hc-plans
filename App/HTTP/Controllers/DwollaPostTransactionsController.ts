import {
  ICreatePostTransactionsUseCaseId,
  ICreatePostTransactionsUseCase,
} from '@application/DwollaPostTransactions/CreatePostTransactionsUseCase/ICreatePostTransactionsUseCase';
import CreatePostTransactionsUseCaseDTO from '@application/DwollaPostTransactions/CreatePostTransactionsUseCase/CreatePostTransactionsUseCaseDTO';
import {
  IDwollaPostTransactionsServiceId,
  IDwollaPostTransactionsService,
} from '@application/DwollaPostTransactions/IDwollaPostTransactionsService';
import { inject, injectable } from 'inversify';
import FetchAllPostTransfersDTO from '@application/DwollaPostTransactions/FetchAllPostTransfersDTO';
import FetchByTransferIdDTO from '@application/DwollaPostTransactions/FetchByTransferIdDTO';

@injectable()
class DwollaPostTransactionController {
  constructor(
    @inject(IDwollaPostTransactionsServiceId)
    private dwollaPostTransactionsService: IDwollaPostTransactionsService,
    @inject(ICreatePostTransactionsUseCaseId)
    private createPostTransactionsUseCase: ICreatePostTransactionsUseCase,
  ) {}

  createPostTransfer = async (httpRequest) => {
    const { uploadId } = httpRequest.params;
    const input = new CreatePostTransactionsUseCaseDTO(uploadId);
    await this.createPostTransactionsUseCase.execute(input);
    return {
      body: {
        status: 'success',
        message: 'Transfer Intitiated',
      },
    };
  };

  getAllPostTransfers = async (httpRequest) => {
    const { page, perPage, showTrashed, query } = httpRequest.query;
    const input = new FetchAllPostTransfersDTO(page, perPage, showTrashed, query);
    const response = await this.dwollaPostTransactionsService.fetchAllPostTransafers(
      input,
    );
    return {
      body: {
        status: 'success',
        data: response,
      },
    };
  };

  getByTransferId = async (httpRequest) => {
    const { dwollaTransferId } = httpRequest.params;
    const input = new FetchByTransferIdDTO(dwollaTransferId);
    const data = await this.dwollaPostTransactionsService.fetchByDwollaTransferId(input);
    return {
      body: {
        status: 'success',
        data,
      },
    };
  };
}

export default DwollaPostTransactionController;
