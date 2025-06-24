import {
  IHoneycombDwollaCustomerRepositoryId,
  IHoneycombDwollaCustomerRepository,
} from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import { IUserRepositoryId, IUserRepository } from '@domain/Core/User/IUserRepository';
import {
  IInvestorPaymentOptionsRepositoryId,
  IInvestorPaymentOptionsRepository,
} from '@domain/InvestorPaymentOptions/IInvestorPaymentOptionsRepository';
import {
  ITransactionsHistoryRepository,
  ITransactionsHistoryRepositoryId,
} from '@domain/Core/TransactionsHistory/ITransactionsHistoryRepository';
import { IDwollaServiceId, IDwollaService } from '@infrastructure/Service/IDwollaService';
import DwollaToBankTransactions from '@domain/Core/DwollaToBankTransactions/DwollaToBankTransactions';
import {
  IDwollaToBankTransactionsRepositoryId,
  IDwollaToBankTransactionsRepository,
} from '@domain/Core/DwollaToBankTransactions/IDwollaToBankTransactionsRepository';
import { IDwollaToBankTransactionsService } from './IDwollaToBankTransactionsService';
import { inject, injectable } from 'inversify';
import CreateDwollaToBankTransactionDTO from './CreateDwollaToBankTransactionDTO';
import uuid from 'uuid/v4';
import FetchAllDwollaToBankTransactionsDTO from './FetchAllDwollaToBankTransactionsDTO';
import FetchAllDwollaToBankTransactionsByUserDTO from './FetchAllDwollaToBankTransactionsByUserDTO';
import TransactionsHistory from '@domain/Core/TransactionsHistory/TransactionsHistory';

@injectable()
class DwollaToBankTransactionsService implements IDwollaToBankTransactionsService {
  constructor(
    @inject(IDwollaToBankTransactionsRepositoryId)
    private dwollaToBankTransactionsRepository: IDwollaToBankTransactionsRepository,
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
    @inject(ITransactionsHistoryRepositoryId)
    private transactionsHistoryRepository: ITransactionsHistoryRepository,
    @inject(IInvestorPaymentOptionsRepositoryId)
    private investorPaymentOptionsRepository: IInvestorPaymentOptionsRepository,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IHoneycombDwollaCustomerRepositoryId)
    private dwollaCustomerRepository: IHoneycombDwollaCustomerRepository,
  ) {}

  async addTransactionHistory(
    cashFlowStatus: string,
    campaignName: string,
    userId: string,
    transferId: string,
    amount: number,
    transferStatus: string,
  ) {
    const transactionsHistory = TransactionsHistory.createFromDetail({
      cashFlowStatus,
      dwollaTransferId: transferId,
      campaignName,
      userId,
      amount,
      transferStatus,
    });
    await this.transactionsHistoryRepository.add(transactionsHistory);
  }

  async addDwollaToBankTransaction(
    createDwollaToBankTransactionDTO: CreateDwollaToBankTransactionDTO,
  ) {
    let idempotencyKey = uuid();
    let dwollaTransactionId = '';
    const userId = createDwollaToBankTransactionDTO.getUserId();
    const dwollaSourceId = createDwollaToBankTransactionDTO.getDwollaSourceId();
    const dwollaBalanceId = createDwollaToBankTransactionDTO.getDwollaBalanceId();
    const amount = createDwollaToBankTransactionDTO.getAmount();
    const fee = await this.dwollaService.createFee(amount, dwollaSourceId);
    const input = {
      transferStatus: 'pending',
      amount,
      dwollaTransactionId,
      idempotencyKey,
    };

    const dwollaToBankTransaction = DwollaToBankTransactions.createFromDetail(input);
    dwollaToBankTransaction.setUserId(userId);
    await this.dwollaToBankTransactionsRepository.createTransafer(
      dwollaToBankTransaction,
    );

    const response = await this.dwollaService.createTransfer({
      sourceId: dwollaBalanceId,
      destinationId: dwollaSourceId,
      amount,
      fee,
      sameDayACH: false,
      idempotencyKey,
    });
    const user = await this.userRepository.fetchById(userId, false);
    const investorBank = await this.investorPaymentOptionsRepository.fetchInvestorBank(
      user.investor.investorId,
    );
    const bank = investorBank.getBank();
    const cashFlowStatus = `Cash Out - ${bank.getAccountType()}**${bank.getLastFour()}`;
    const { status } = await this.dwollaService.retrieveTransfer(response);
    let transferStatus = status ? status : 'pending';
    await this.addTransactionHistory(
      cashFlowStatus,
      '',
      userId,
      response,
      amount,
      transferStatus,
    );

    const dwollaToBankTransactionObject = await this.dwollaToBankTransactionsRepository.fetchOneByCustomCritera(
      {
        whereConditions: { idempotencyKey },
      },
    );

    if (dwollaToBankTransactionObject) {
      const inputDwollaToBankTransactions = {
        ...dwollaToBankTransactionObject,
        dwollaTransactionId: response,
        transferStatus,
      };
      await this.dwollaToBankTransactionsRepository.updateTransfer(
        inputDwollaToBankTransactions,
      );

      return true;
    } else {
      return false;
    }
  }

  async fetchAllDwollaToBankTransactions(
    fetchAllDwollaToBankTransactionsDTO: FetchAllDwollaToBankTransactionsDTO,
  ) {
    const response = await this.dwollaToBankTransactionsRepository.fetchAllTransferRecords(
      {
        paginationOptions: fetchAllDwollaToBankTransactionsDTO.getPaginationOptions(),
        query: fetchAllDwollaToBankTransactionsDTO.getQuery(),
      },
    );
    const result = await Promise.all(
      response.dwollaToBankTransactions.map(async (dwollaToBankTransaction) => {
        const dwollaCustomer = await this.dwollaCustomerRepository.fetchByUserId(
          dwollaToBankTransaction.userId,
        );
        const user = await this.userRepository.fetchById(dwollaToBankTransaction.userId);
        const investorPaymentOption = await this.investorPaymentOptionsRepository.fetchInvestorBank(
          user.investor.investorId,
        );

        const dwollaToBankTransactionObject = {
          ...dwollaToBankTransaction,
          dwollaSourceId: dwollaCustomer.getDwollaBalanceId(),
          dwollaDestinationId: investorPaymentOption.getBank().getDwollaFundingSourceId(),
        };
        return dwollaToBankTransactionObject;
      }),
    );

    const paginationInfo = {
      page: fetchAllDwollaToBankTransactionsDTO.getPaginationOptions().currentPage,
      perPage: fetchAllDwollaToBankTransactionsDTO.getPaginationOptions().perPage,
      totalItems: response.dwollaToBankTransactionsCount[0].totalItems,
      totalPages: Math.ceil(
        response.dwollaToBankTransactionsCount[0].totalItems /
          fetchAllDwollaToBankTransactionsDTO.getPaginationOptions().limit(),
      ),
    };
    return {
      status: 'success',
      paginationInfo,
      data: result,
    };
  }

  async fetchAllDwollaToBankTransactionsByUser(
    fetchAllDwollaToBankTransactionsByUserDTO: FetchAllDwollaToBankTransactionsByUserDTO,
  ) {
    return this.transactionsHistoryRepository.getAllInvestorTransafers(
      fetchAllDwollaToBankTransactionsByUserDTO.getUserId(),
    );
  }
}

export default DwollaToBankTransactionsService;
