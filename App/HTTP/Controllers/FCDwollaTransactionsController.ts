import CreateFCDwollaTransactionsDTO from '@application/FCDwollaTransactions/CreateFCDwollaTransactionsDTO';
import FetchAllFCDwollaTransactionsDTO from '@application/FCDwollaTransactions/FetchAllFCDwollaTransactionsDTO';
import {
  IFCDwollaTransactionsService,
  IFCDwollaTransactionsServiceId,
} from '@application/FCDwollaTransactions/IFCDwollaTransactionsService';
import { inject, injectable } from 'inversify';

@injectable()
class FCDwollaTransactionsController {
  constructor(
    @inject(IFCDwollaTransactionsServiceId)
    private fcDwollaTransactionsService: IFCDwollaTransactionsService,
  ) {}

  sendFundsToDwolla = async (httpRequest) => {
    const { amount } = httpRequest.body;
    const requestedBy = httpRequest.adminUser.getName();
    const dto = new CreateFCDwollaTransactionsDTO(requestedBy, amount);
    await this.fcDwollaTransactionsService.createTransactions(dto);

    return {
      body: {
        status: 'success',
        message: 'Your transaction is on the way!',
      },
    };
  };

  fetchAllTransactions = async (httpRequest) => {
    const { page, perPage } = httpRequest.query;
    const dto = new FetchAllFCDwollaTransactionsDTO(page, perPage);
    const response = await this.fcDwollaTransactionsService.fetchAllTransactions(dto);

    return {
      body: {
        status: 'success',
        data: response,
      },
    };
  };
}

export default FCDwollaTransactionsController;
