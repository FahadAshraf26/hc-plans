import async from 'async';
import {
  IDwollaCustodyTransactionsRepository,
  IDwollaCustodyTransactionsRepositoryId,
} from '@domain/Core/DwollaCustodyTransactions/IDwollaCustodyTransactionsRepository';
import { inject, injectable } from 'inversify';
import { IDwollaCustodyTransactionsService } from './IDwollaCustodyTransactionsService';
import FetchAllCustodyTransfersDTO from './FetchAllCustodyTransfersDTO';
import FetchAllCompletedCustodyTransfersDTO from './FetchAllCompletedCustodyTransferDTO';
import CreateTransferToWalletDTO from './CreateTransferToWalletDTO';
import uuid from 'uuid/v4';
import {
  IIssuerRepository,
  IIssuerRepositoryId,
} from '@domain/Core/Issuer/IIssuerRepository';
import {
  IHoneycombDwollaCustomerRepository,
  IHoneycombDwollaCustomerRepositoryId,
} from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import { IDwollaService, IDwollaServiceId } from '@infrastructure/Service/IDwollaService';
import Config from '@infrastructure/Config';
import HttpError from '@infrastructure/Errors/HttpException';
import DwollaPostBankTransactions from '@domain/Core/DwollaPostBankTransactions/DwollaPostBankTransactions';
import {
  IDwollaPostBankTransactionsRepository,
  IDwollaPostBankTransactionsRepositoryId,
} from '@domain/Core/DwollaPostBankTransactions/IDwollaPostBankTransactionsRepository';
import {
  IDwollaCustodyTransferHistoryRepository,
  IDwollaCustodyTransferHistoryRepositoryId,
} from '@domain/Core/DwollaCustodyTransferHistory/IDwollaCustodyTransferHistoryRepository';
import DwollaCustodyTransferHistory from '@domain/Core/DwollaCustodyTransferHistory/DwollaCustodyTransferHistory';
import ReUploadFailedTransfer from './ReUploadFailedTransfers';
import {
  IDwollaPreBankTransactionsRepository,
  IDwollaPreBankTransactionsRepositoryId,
} from '@domain/Core/DwollaPreBankTransactions/IDwollaPreBankTransactionsRepository';

const {
  dwolla: { dwolla },
} = Config;
@injectable()
class DwollaCustodyTransactionsService implements IDwollaCustodyTransactionsService {
  constructor(
    @inject(IDwollaCustodyTransactionsRepositoryId)
    private dwollaCustodyTransactionsRepository: IDwollaCustodyTransactionsRepository,
    @inject(IDwollaPostBankTransactionsRepositoryId)
    private dwollaPostTransactionsRepository: IDwollaPostBankTransactionsRepository,
    @inject(IDwollaCustodyTransferHistoryRepositoryId)
    private dwollaCustodyTransferHistoryRepository: IDwollaCustodyTransferHistoryRepository,
    @inject(IIssuerRepositoryId) private issuerRepository: IIssuerRepository,
    @inject(IHoneycombDwollaCustomerRepositoryId)
    private honeycombDwollaCustomerRepository: IHoneycombDwollaCustomerRepository,
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
    @inject(IDwollaPreBankTransactionsRepositoryId)
    private dwollaPreBankTransactionsRepository: IDwollaPreBankTransactionsRepository,
  ) {}

  async fetchAllCustodyTransafers(
    fetchAllCustodyTransfersDTO: FetchAllCustodyTransfersDTO,
  ) {
    const response = await this.dwollaCustodyTransactionsRepository.fetchCustodyTransafers(
      fetchAllCustodyTransfersDTO.getPaginationOptions(),
      fetchAllCustodyTransfersDTO.isShowTrashed(),
    );

    return response.getPaginatedData();
  }
  async fetchAllCompletedCustodyTransafers(
    fetchAllCompletedCustodyTransfersDTO: FetchAllCompletedCustodyTransfersDTO,
  ) {
    const response = await this.dwollaCustodyTransactionsRepository.fetchCompletedCustodyTransafers(
      fetchAllCompletedCustodyTransfersDTO.getPaginationOptions(),
      fetchAllCompletedCustodyTransfersDTO.isShowTrashed(),
    );

    return response.getPaginatedData();
  }

  async createTransferToWallet(createTransferToWalletDTO: CreateTransferToWalletDTO) {
    const issuerId = createTransferToWalletDTO.getIssuerId();
    let transferId = '';
    let idempotencyId = uuid();

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
                  status: 'Proccessed',
                  idempotencyId: idempotencyId,
                  dwollaTransferId: transferId,
                  businessOwnerName: dwollaCustodyTransaction.businessOwnerName,
                  businessOwnerEmail: dwollaCustodyTransaction.businessOwnerEmail,
                  amount: dwollaCustodyTransaction.amount,
                  issuerId: issuer.issuerId,
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
        } else {
          throw new HttpError(404, `No Business Customer for ${issuer.issuerName}`);
        }
      }
    }
    return true;
  }

  async reUploadFailedTransfer(reUploadFailedTransfer: ReUploadFailedTransfer) {
    const dwollaCustodyTransaction = await this.dwollaCustodyTransactionsRepository.fetchById(
      reUploadFailedTransfer.getDwollaCustodyTransactionId(),
      false,
    );
    if (dwollaCustodyTransaction) {
      const dwollaPreBankTransaction = await this.dwollaPreBankTransactionsRepository.fetchById(
        dwollaCustodyTransaction.getDwollaPreBankTransactionId(),
      );

      const updatedDwollaPreBankTransaction = {
        ...dwollaPreBankTransaction,
        status: 'success',
      };

      await this.dwollaPreBankTransactionsRepository.update(
        updatedDwollaPreBankTransaction,
        {
          dwollaPreBankTransactionId: dwollaPreBankTransaction.getDwollaPreBankTransactionId(),
        },
      );

      await this.dwollaCustodyTransactionsRepository.remove(
        dwollaCustodyTransaction,
        true,
      );
    }
  }
}
export default DwollaCustodyTransactionsService;
