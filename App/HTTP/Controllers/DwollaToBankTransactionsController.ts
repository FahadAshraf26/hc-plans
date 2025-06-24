import CreateDwollaToBankTransactionDTO from '@application/DwollaToBankTransactions/CreateDwollaToBankTransactionDTO';
import FetchAllDwollaToBankTransactionsDTO from '@application/DwollaToBankTransactions/FetchAllDwollaToBankTransactionsDTO';
import FetchAllDwollaToBankTransactionsByUserDTO from '@application/DwollaToBankTransactions/FetchAllDwollaToBankTransactionsByUserDTO';
import {
  IDwollaToBankTransactionsServiceId,
  IDwollaToBankTransactionsService,
} from '@application/DwollaToBankTransactions/IDwollaToBankTransactionsService';
import { inject, injectable } from 'inversify';
import { IDwollaService, IDwollaServiceId } from '@infrastructure/Service/IDwollaService';

@injectable()
class DwollaToBankTransactionsController {
  constructor(
    @inject(IDwollaToBankTransactionsServiceId)
    private dwollaToBankTransactionsSerivce: IDwollaToBankTransactionsService,
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
  ) {}

  addDwollaToBankTransaction = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const { amount, dwollaBalanceId, dwollaSourceId } = httpRequest.body;
    const input = new CreateDwollaToBankTransactionDTO(
      userId,
      dwollaSourceId,
      dwollaBalanceId,
      amount,
    );

    await this.dwollaToBankTransactionsSerivce.addDwollaToBankTransaction(input);
    return {
      body: {
        status: 'success',
        message: `${amount} is on its way`,
      },
    };
  };

  getAllDwollaToBankTransactions = async (httpRequest) => {
    const { page, perPage, query } = httpRequest.query;
    const input = new FetchAllDwollaToBankTransactionsDTO(page, perPage, query);
    const response = await this.dwollaToBankTransactionsSerivce.fetchAllDwollaToBankTransactions(
      input,
    );
    return {
      body: response,
    };
  };

  getAllDwollaToBankTransactionsByUser = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const input = new FetchAllDwollaToBankTransactionsByUserDTO(userId);
    const response = await this.dwollaToBankTransactionsSerivce.fetchAllDwollaToBankTransactionsByUser(
      input,
    );
    return {
      body: {
        status: 'success',
        data: response,
      },
    };
  };

  sendFunds = async (httpRequest) => {
    const { dwollaSourceId, dwollaDestinationId, amount } = httpRequest.body;
    const data = await this.dwollaService.createTransfer({
      sourceId: dwollaSourceId,
      destinationId: dwollaDestinationId,
      amount,
      fee: 0,
      sameDayACH: false,
      idempotencyKey: undefined,
    });

    return {
      body: {
        status: "success",
        data
      }
    }
  };
}

export default DwollaToBankTransactionsController;
