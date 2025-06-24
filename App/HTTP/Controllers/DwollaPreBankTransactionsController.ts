import {
  IReEvaluatePreBankTransactionsUseCaseId,
  IReEvaluatePreBankTransactionsUseCase,
} from '@application/DwollaPreBankTransactions/ReEvaluatePreBankTransactions/IReEvaluatePreBankTransactionsUseCase';
import {
  ICreateDwollaPreBankTransactionsUsecaseId,
  ICreateDwollaPreBankTransactionsUsecase,
} from '@application/DwollaPreBankTransactions/CreateDwollaPreBankTransactionsUseCase/ICreateDwollaPreBankTransactionsUsecase';
import {
  IDwollaPreBankTransactionsServiceId,
  IDwollaPreBankTransactionsService,
} from '@application/DwollaPreBankTransactions/IDwollaPreBankTransactionService';
import { inject, injectable } from 'inversify';
import UpdateDwollaPreBankTransactionsDTO from '@application/DwollaPreBankTransactions/UpdateDwollaPreBankTransactionsDTO';
import FetchDwollaPreBankPreTransactionsByIdDTO from '@application/DwollaPreBankTransactions/FetchDwollaPreBankTransactionsByIdDTO';
import CreateDwollaPreBankTransactionDTO from '@application/DwollaPreBankTransactions/CreateDwollaPreBankTransactionsUseCase/CreateDwollaPreBankTransactionsDTO';
import ReEvaluatePreBankTransactionsDTO from '@application/DwollaPreBankTransactions/ReEvaluatePreBankTransactions/ReEvaluatePreBankTransactionsDTO';
@injectable()
class DwollaPreBankTransactionsController {
  constructor(
    @inject(IDwollaPreBankTransactionsServiceId)
    private dwollaPreBankTransactionsService: IDwollaPreBankTransactionsService,
    @inject(ICreateDwollaPreBankTransactionsUsecaseId)
    private createDwollaPreBankTransactionsUseCase: ICreateDwollaPreBankTransactionsUsecase,
    @inject(IReEvaluatePreBankTransactionsUseCaseId)
    private reEvaluatePreBankTransactionsUseCase: IReEvaluatePreBankTransactionsUseCase,
  ) {}

  addDwollaPreBankTransactions = async (httpRequest) => {
    const { file } = httpRequest;
    const input = new CreateDwollaPreBankTransactionDTO(file);
    const response = await this.createDwollaPreBankTransactionsUseCase.execute(input);
    return {
      body: {
        status: response.status,
        message: response.message,
      },
    };
  };

  getAllLatestPreBankTransactionsForWallet = async (httRequest) => {
    const response = await this.dwollaPreBankTransactionsService.fetchLatestPreBankTransactionsForWallet();
    return {
      body: {
        status: response.status,
        data: response.data,
      },
    };
  };

  getAllLatestPreBankTransactionsForCustody = async (httRequest) => {
    const response = await this.dwollaPreBankTransactionsService.fetchLatestPreBankTransactionsForCustody();
    return {
      body: {
        status: response.status,
        data: response.data,
      },
    };
  };

  updatePreBankTransactions = async (httpRequest) => {
    const { dwollaPreBankTransactionId } = httpRequest.params;
    const { body } = httpRequest;

    const input = new UpdateDwollaPreBankTransactionsDTO(
      dwollaPreBankTransactionId,
      body,
    );
    await this.dwollaPreBankTransactionsService.updatePreBankTransactions(input);
    return {
      body: {
        status: 'success',
        message: 'Dwolla Pre Bank Transaction Updated Successfully',
      },
    };
  };

  getDwollaPreBankTransactionById = async (httpRequest) => {
    const { dwollaPreBankTransactionId } = httpRequest.params;
    const input = new FetchDwollaPreBankPreTransactionsByIdDTO(
      dwollaPreBankTransactionId,
    );
    const data = await this.dwollaPreBankTransactionsService.getPreBankTransactionsById(
      input,
    );
    return {
      body: {
        status: 'success',
        data,
      },
    };
  };

  removeByUploadId = async (httpRequest) => {
    const { uploadId } = httpRequest.params;
    await this.dwollaPreBankTransactionsService.removeByUploadId(uploadId);
    return {
      body: {
        status: 'success',
        message: 'Data Removed Successfully',
      },
    };
  };

  removeByDwollaPreBankTransactionId = async (httpRequest) => {
    const { dwollaPreBankTransactionId } = httpRequest.params;
    await this.dwollaPreBankTransactionsService.removeByDwollaPreBankTransactionId(dwollaPreBankTransactionId);
    return {
      body: {
        status: 'success',
        message: 'Data Removed Successfully',
      },
    };
  };

  reEvaluateData = async (httpRequest) => {
    const { uploadId } = httpRequest.params;
    const input = new ReEvaluatePreBankTransactionsDTO(uploadId);
    await this.reEvaluatePreBankTransactionsUseCase.execute(input);
    return {
      body: {
        status: 'success',
        message: 'Data ReEvaluated Successfully',
      },
    };
  };
}

export default DwollaPreBankTransactionsController;
