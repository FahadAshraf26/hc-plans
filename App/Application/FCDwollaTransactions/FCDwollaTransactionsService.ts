import {
  IAdminUserRepository,
  IAdminUserRepositoryId,
} from '@domain/Core/AdminUser/IAdminUserRepository';
import FCDwollaTransactions from '@domain/Core/FCDwollaTransactions/FCDwollaTransactions';
import {
  IFCDwollaTransactionsRepository,
  IFCDwollaTransactionsRepositoryId,
} from '@domain/Core/FCDwollaTransactions/IFCDwollaTransactionsRepository';
import config from '@infrastructure/Config';
import { IDwollaService, IDwollaServiceId } from '@infrastructure/Service/IDwollaService';
import { inject, injectable } from 'inversify';
import CreateFCDwollaTransactionsDTO from './CreateFCDwollaTransactionsDTO';
import FetchAllFCDwollaTransactionsDTO from './FetchAllFCDwollaTransactionsDTO';
import { IFCDwollaTransactionsService } from './IFCDwollaTransactionsService';

const { dwolla } = config.dwolla;

@injectable()
export default class FCDwollaTransactionsService implements IFCDwollaTransactionsService {
  constructor(
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
    @inject(IFCDwollaTransactionsRepositoryId)
    private fcDwollaTransactionsRepository: IFCDwollaTransactionsRepository,
    @inject(IAdminUserRepositoryId) private adminUserRepository: IAdminUserRepository,
  ) {}

  async createTransactions(dto: CreateFCDwollaTransactionsDTO) {
    const transactionId = await this.dwollaService.createTransfer({
      sourceId: dwolla.DWOLLA_RE_INVESTMENT_ID_FIRST_CITIZEN,
      destinationId: dwolla.DWOLLA_HONEYCOMB_WALLET_ID,
      amount: dto.amount,
      fee: 0,
      sameDayACH: false,
      idempotencyKey: undefined,
    });

    const { status } = await this.dwollaService.retrieveTransfer(transactionId);

    const transaction = FCDwollaTransactions.createFromDetail({
      status: status,
      amount: dto.amount,
      requestedBy: dto.requestedBy,
      dwollaTransactionId: transactionId,
    });

    await this.fcDwollaTransactionsRepository.add(transaction);
    return true;
  }

  async fetchAllTransactions(dto: FetchAllFCDwollaTransactionsDTO) {
    return this.fcDwollaTransactionsRepository.fetchAll({
      paginationOptions: dto.paginationOptions,
    });
  }
}
