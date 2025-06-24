import {
  IIssuerBankRepositoryId,
  IIssuerBankRepository,
} from '@domain/Core/IssuerBank/IIssuerBankRepository';
import { IDwollaServiceId, IDwollaService } from '@infrastructure/Service/IDwollaService';
import {
  IIssuerRepositoryId,
  IIssuerRepository,
} from '@domain/Core/Issuer/IIssuerRepository';
import {
  IDwollaPreBankTransactionsRepositoryId,
  IDwollaPreBankTransactionsRepository,
} from '@domain/Core/DwollaPreBankTransactions/IDwollaPreBankTransactionsRepository';
import { injectable, inject } from 'inversify';
import async from 'async';
import uuid from 'uuid/v4';
import { ITransferFundsToCustodyUseCase } from './ITransferFundsToCustodyUsecase';
import TransferFundsToCustodyUseCaseDTO from './TransferFundToCustodyUsecaseDTO';
import Config from '@infrastructure/Config';
import {
  IDwollaCustodyTransactionsRepository,
  IDwollaCustodyTransactionsRepositoryId,
} from '@domain/Core/DwollaCustodyTransactions/IDwollaCustodyTransactionsRepository';
import DwollaCustodyTransactions from '@domain/Core/DwollaCustodyTransactions/DwollaCustodyTransactions';

const {
  dwolla: { dwolla },
} = Config;

@injectable()
class TransferFundsToCustodyUsecase implements ITransferFundsToCustodyUseCase {
  constructor(
    @inject(IDwollaCustodyTransactionsRepositoryId)
    private dwollaCustodyTransactionsRepository: IDwollaCustodyTransactionsRepository,
    @inject(IDwollaPreBankTransactionsRepositoryId)
    private dwollaPreBankTransactionRepository: IDwollaPreBankTransactionsRepository,
    @inject(IIssuerRepositoryId) private issuerRepository: IIssuerRepository,
    @inject(IDwollaServiceId) private dwollaSerivce: IDwollaService,
    @inject(IIssuerBankRepositoryId) private issuerBankRepository: IIssuerBankRepository,
  ) {}

  async bankToCustodyTransfer(dwollaPreBankTransaction, issuer, idempotencyId) {
    const issuerBanks = await this.issuerBankRepository.fetchAllBanksByIssuerId(
      issuer.issuerId,
    );

    const issuerBank = issuerBanks.find((item) => item.isForRepayment === true);

    const dwollaSourceBalanceId = issuerBank.dwollaSourceId;
    const dwollaFee = await this.dwollaSerivce.createFee(
      dwollaPreBankTransaction.amount,
      dwolla.DWOLLA_HONEYCOMB_CUSTODY_ACCOUNT,
    );

    return this.dwollaSerivce.createTransfer({
      sourceId: dwollaSourceBalanceId,
      destinationId: dwolla.DWOLLA_HONEYCOMB_CUSTODY_ACCOUNT,
      amount: dwollaPreBankTransaction.amount,
      fee: dwollaFee,
      sameDayACH: false,
      idempotencyKey: idempotencyId,
    });
  }

  async execute(createPostBankTransactionsUseCaseDTO: TransferFundsToCustodyUseCaseDTO) {
    const uploadId = createPostBankTransactionsUseCaseDTO.getUploadId();
    const dwollaPreBankTransactions = await this.dwollaPreBankTransactionRepository.fetchAllByUploadId(
      uploadId,
    );

    return async.eachSeries(
      dwollaPreBankTransactions,
      async (dwollaPreBankTransaction: any) => {
        let dwollaCustodyTransactionId = uuid();
        let idempotencyId = uuid();
        let transferId = '';

        const issuer = await this.issuerRepository.fetchOneByCustomCritera({
          whereConditions: { issuerName: dwollaPreBankTransaction.issuerName },
        });

        if (issuer) {
          const custodyTransactionInput = {
            dwollaCustodyTransactionId,
            source: dwollaPreBankTransaction.source,
            destination: dwollaPreBankTransaction.destination,
            notCompletedStatus: 'pending',
            completedStatus: 'pending',
            idempotencyId,
            dwollaTransferId: transferId,
            businessOwnerName: dwollaPreBankTransaction.businessOwnerName,
            businessOwnerEmail: dwollaPreBankTransaction.businessOwnerEmail,
            amount: dwollaPreBankTransaction.amount,
            isCompleted: false,
          };

          const dwollaCustodyTransactionObject = DwollaCustodyTransactions.createFromDetail(
            custodyTransactionInput,
          );
          dwollaCustodyTransactionObject.setIssuerId(issuer.issuerId);
          dwollaCustodyTransactionObject.setDwollaPreBankTransactionId(
            dwollaPreBankTransaction.dwollaPreBankTransactionId,
          );

          if (
            dwollaPreBankTransaction.source.toLowerCase() === 'bank' &&
            dwollaPreBankTransaction.destination.toLowerCase() === 'custody'
          ) {
            transferId = await this.bankToCustodyTransfer(
              dwollaPreBankTransaction,
              issuer,
              idempotencyId,
            );
          }

          dwollaCustodyTransactionObject.setDwollaTransferId(transferId);

          await this.dwollaCustodyTransactionsRepository.add(
            dwollaCustodyTransactionObject,
          );

          const dwollaCustodyTransaction = await this.dwollaCustodyTransactionsRepository.fetchOneByCustomCritera(
            {
              whereConditions: {
                dwollaPreBankTransactionId:
                  dwollaPreBankTransaction.dwollaPreBankTransactionId,
              },
            },
          );
          if (transferId !== '') {
            dwollaPreBankTransaction.status = 'Processed';
            await this.dwollaPreBankTransactionRepository.update(
              dwollaPreBankTransaction,
              {
                uploadId,
              },
            );

            if (dwollaCustodyTransaction) {
              const input = {
                ...dwollaCustodyTransaction,
                dwollaTransferId: transferId,
              };
              await this.dwollaCustodyTransactionsRepository.update(input, {
                dwollaCustodyTransactionId:
                  dwollaCustodyTransaction.dwollaCustodyTransactionId,
              });
            }
          } else {
            await this.dwollaCustodyTransactionsRepository.remove(
              dwollaCustodyTransaction,
              true,
            );
          }
        }
      },
    );
  }
}

export default TransferFundsToCustodyUsecase;
