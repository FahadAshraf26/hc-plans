import {
  IReEvaluatePreTransactionsUseCaseId,
  IReEvaluatePreTransactionsUseCase,
} from '@application/DwollaPreTransactions/ReEvaluatePreTransactions/IReEvaluatePreTransactionsUseCase';
import {
  ICreateDwollaPreTransactionsUsecaseId,
  ICreateDwollaPreTransactionsUsecase,
} from '@application/DwollaPreTransactions/CreateDwollaPreTransactionsUsecase/ICreateDwollaPreTransactionsUsecase';
import CreateDwollaPreTransactionDTO from '@application/DwollaPreTransactions/CreateDwollaPreTransactionsUsecase/CreateDwollaPreTransactionsDTO';
import {
  IDwollaPreTransactionsServiceId,
  IDwollaPreTransactionsService,
} from '@application/DwollaPreTransactions/IDwollaPreTransactionsService';
import { inject, injectable } from 'inversify';
import UpdatePreTransactionDTO from '@application/DwollaPreTransactions/UpdatePreTransactionDTO';
import ReEvaluatePreTransactionsDTO from '@application/DwollaPreTransactions/ReEvaluatePreTransactions/ReEvaluatePreTransactionsDTO';
import FetchPreTransactionsByIdDTO from '@application/DwollaPreTransactions/FetchPreTransactionsByIdDTO';

@injectable()
class DwollaPreTransactionsController {
  constructor(
    @inject(IDwollaPreTransactionsServiceId)
    private dwollaPreTransactionsService: IDwollaPreTransactionsService,
    @inject(ICreateDwollaPreTransactionsUsecaseId)
    private createDwollaPreTransactionUsecase: ICreateDwollaPreTransactionsUsecase,
    @inject(IReEvaluatePreTransactionsUseCaseId)
    private reEvaluatePreTransactionUseCase: IReEvaluatePreTransactionsUseCase,
  ) {}

  addDwollaPreTransactions = async (httRequest) => {
    const { file } = httRequest;
    const input = new CreateDwollaPreTransactionDTO(file);
    const response = await this.createDwollaPreTransactionUsecase.execute(input);
    return {
      body: {
        status: response.status,
        message: response.message,
      },
    };
  };

  getAllLatestPreTransactions = async (httRequest) => {
    const response = await this.dwollaPreTransactionsService.fetchLatestPreTransactions();
    return {
      body: {
        status: response.status,
        data: response.data,
        totalAmount: response.totalAmount,
        totalCount: response.totalCount,
      },
    };
  };

  updatePreTransactions = async (httpRequest) => {
    const { dwollaPreTransactionId } = httpRequest.params;
    const { body } = httpRequest;

    const input = new UpdatePreTransactionDTO(dwollaPreTransactionId, body);
    await this.dwollaPreTransactionsService.updatePreTransactions(input);
    return {
      body: {
        status: 'success',
        message: 'Dwolla Pre Transaction Updated Successfully',
      },
    };
  };

  reEvaluatePreTransactions = async (httpRequest) => {
    const { uploadId } = httpRequest.params;
    const input = new ReEvaluatePreTransactionsDTO(uploadId);
    await this.reEvaluatePreTransactionUseCase.reEvaluatePreTransactions(input);
    return {
      body: {
        status: 'success',
        message: 'Dwolla PreTransactions ReEvaluated',
      },
    };
  };

  getDwollaPreTransactionById = async (httpRequest) => {
    const { dwollaPreTransactionId } = httpRequest.params;
    const input = new FetchPreTransactionsByIdDTO(dwollaPreTransactionId);
    const data = await this.dwollaPreTransactionsService.getPreTransactionsById(input);
    return {
      body: {
        status: 'success',
        data,
      },
    };
  };

  removeByUploadId = async (httpRequest) => {
    const { uploadId } = httpRequest.params;
    await this.dwollaPreTransactionsService.removeByUploadId(uploadId);
    return {
      body: {
        status: 'success',
        message: 'Data Removed Successfully',
      },
    };
  };
}

export default DwollaPreTransactionsController;
