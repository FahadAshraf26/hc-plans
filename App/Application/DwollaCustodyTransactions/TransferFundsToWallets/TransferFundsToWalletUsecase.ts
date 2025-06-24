import { IDwollaServiceId, IDwollaService } from '@infrastructure/Service/IDwollaService';
import {
  IIssuerRepositoryId,
  IIssuerRepository,
} from '@domain/Core/Issuer/IIssuerRepository';
import { injectable, inject } from 'inversify';
import async from 'async';
import uuid from 'uuid/v4';
import {
  IDwollaCustodyTransactionsRepository,
  IDwollaCustodyTransactionsRepositoryId,
} from '@domain/Core/DwollaCustodyTransactions/IDwollaCustodyTransactionsRepository';
import { ITransferFundsToWalletUseCase } from './ITransferFundsToWalletUsecase';
import {
  IHoneycombDwollaCustomerRepository,
  IHoneycombDwollaCustomerRepositoryId,
} from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import Config from '@infrastructure/Config';
import HttpError from '@infrastructure/Errors/HttpException';
import DwollaCustodyTransferHistory from '@domain/Core/DwollaCustodyTransferHistory/DwollaCustodyTransferHistory';
import {
  IDwollaCustodyTransferHistoryRepository,
  IDwollaCustodyTransferHistoryRepositoryId,
} from '@domain/Core/DwollaCustodyTransferHistory/IDwollaCustodyTransferHistoryRepository';
import DwollaPostBankTransactions from '@domain/Core/DwollaPostBankTransactions/DwollaPostBankTransactions';
import {
  IDwollaPostBankTransactionsRepository,
  IDwollaPostBankTransactionsRepositoryId,
} from '@domain/Core/DwollaPostBankTransactions/IDwollaPostBankTransactionsRepository';

const {
  dwolla: { dwolla },
} = Config;

@injectable()
class TransferFundsToWalletUsecase implements ITransferFundsToWalletUseCase {
  constructor(
    @inject(IDwollaCustodyTransactionsRepositoryId)
    private dwollaCustodyTransactionsRepository: IDwollaCustodyTransactionsRepository,
    @inject(IDwollaCustodyTransferHistoryRepositoryId)
    private dwollaCustodyTransferHistoryRepository: IDwollaCustodyTransferHistoryRepository,
    @inject(IDwollaPostBankTransactionsRepositoryId)
    private dwollaPostTransactionsRepository: IDwollaPostBankTransactionsRepository,
    @inject(IIssuerRepositoryId) private issuerRepository: IIssuerRepository,
    @inject(IDwollaServiceId) private dwollaSerivce: IDwollaService,
    @inject(IHoneycombDwollaCustomerRepositoryId)
    private honeycombDwollaCustomerRepository: IHoneycombDwollaCustomerRepository,
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
  ) {}

  async execute() {
    const issuerIdsList = await this.dwollaCustodyTransactionsRepository.fetchDistinctIssuerIds();

    return async.eachSeries(issuerIdsList, async (issuerIdList: any) => {
      const issuerId = issuerIdList.issuerId;
      let idempotencyId = uuid();
      let transferId = '';

      const totalAmount = await this.dwollaCustodyTransactionsRepository.fetchTotalAmountofSuccessfulCustodyTransactionsByIssuerId(
        issuerId,
      );
      const dwollaCustodyTransactions = await this.dwollaCustodyTransactionsRepository.fetchSuccessfulByIssuerId(
        issuerId,
      );

      if (totalAmount > 0 && dwollaCustodyTransactions.length > 0) {
        const issuer = await this.issuerRepository.fetchById(issuerId);

        if (issuer) {
          const dwollaBusinessCustomer = await this.honeycombDwollaCustomerRepository.fetchByIssuerId(
            issuer.issuerId,
          );
          if (dwollaBusinessCustomer) {
            const dwollaFee = await this.dwollaService.createFee(
              totalAmount,
              dwollaBusinessCustomer.getDwollaCustomerId(),
            );
            transferId = await this.dwollaService.createTransfer({
              sourceId: dwolla.DWOLLA_HONEYCOMB_CUSTODY_ACCOUNT,
              destinationId: dwollaBusinessCustomer.getDwollaBalanceId(),
              amount: totalAmount,
              fee: dwollaFee,
              sameDayACH: false,
              idempotencyKey: idempotencyId,
            });
            const dwollaCustodyTransaction = dwollaCustodyTransactions[0];

            const dwollaCustodyTransferHistory = DwollaCustodyTransferHistory.createFromDetail(
              {
                source: dwollaCustodyTransaction.source,
                destination: dwollaCustodyTransaction.destination,
                dwollaTransferId: transferId,
                businessOwnerName: dwollaCustodyTransaction.businessOwnerName,
                businessOwnerEmail: dwollaCustodyTransaction.businessOwnerEmail,
                amount: totalAmount,
                issuerId: issuer.issuerId,
              },
            );
            await this.dwollaCustodyTransferHistoryRepository.add(
              dwollaCustodyTransferHistory,
            );
            await async.eachSeries(
              dwollaCustodyTransactions,
              async (dwollaCustodyTransaction: any) => {
                const dwollaPostBankTransaction = DwollaPostBankTransactions.createFromDetail(
                  {
                    source: dwollaCustodyTransaction.source,
                    destination: dwollaCustodyTransaction.destination,
                    notCompletedStatus: 'proccessed',
                    completedStatus: 'Pending',
                    idempotencyId: idempotencyId,
                    dwollaTransferId: transferId,
                    businessOwnerName: dwollaCustodyTransaction.businessOwnerName,
                    businessOwnerEmail: dwollaCustodyTransaction.businessOwnerEmail,
                    amount: dwollaCustodyTransaction.amount,
                  },
                );

                dwollaPostBankTransaction.setDwollaPreBankTransactionId(
                  dwollaCustodyTransaction.getDwollaPreBankTransactionId(),
                );
                dwollaPostBankTransaction.setIssuerId(
                  dwollaCustodyTransaction.getIssuerId(),
                );
                dwollaPostBankTransaction.setDwollaCustodyTransferHistoryId(
                  dwollaCustodyTransferHistory.getDwollaCustodyTransferHistoryId(),
                );
                const dwollaPostBankTransactionIsAdded = await this.dwollaPostTransactionsRepository.add(
                  dwollaPostBankTransaction,
                );

                if (transferId && dwollaPostBankTransactionIsAdded) {
                  await this.dwollaCustodyTransactionsRepository.updateByCustodyTransferId(
                    dwollaCustodyTransaction.dwollaCustodyTransactionId,
                    transferId,
                  );
                }
              },
            );
          }
        }
      }
    });
  }
}

export default TransferFundsToWalletUsecase;
