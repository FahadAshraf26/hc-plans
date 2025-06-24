import {
  IIssuerBankRepositoryId,
  IIssuerBankRepository,
} from '@domain/Core/IssuerBank/IIssuerBankRepository';
import { IDwollaServiceId, IDwollaService } from '@infrastructure/Service/IDwollaService';
import {
  IHoneycombDwollaCustomerRepositoryId,
  IHoneycombDwollaCustomerRepository,
} from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import {
  IIssuerRepositoryId,
  IIssuerRepository,
} from '@domain/Core/Issuer/IIssuerRepository';
import DwollaPostBankTransactions from '@domain/Core/DwollaPostBankTransactions/DwollaPostBankTransactions';
import { ICreatePostBankTransactionsUseCase } from './ICreatePostBankTransactionsUseCase';
import CreatePostBankTransactionsUseCaseDTO from '@application/DwollaPostBankTransactions/CreatePostBankTransactionsUseCase/CreatePostBankTransactionsUseCaseDTO';
import {
  IDwollaPostBankTransactionsRepositoryId,
  IDwollaPostBankTransactionsRepository,
} from '@domain/Core/DwollaPostBankTransactions/IDwollaPostBankTransactionsRepository';
import {
  IDwollaPreBankTransactionsRepositoryId,
  IDwollaPreBankTransactionsRepository,
} from '@domain/Core/DwollaPreBankTransactions/IDwollaPreBankTransactionsRepository';
import { injectable, inject } from 'inversify';
import async from 'async';
import uuid from 'uuid/v4';

@injectable()
class CreatePostBankTransactionsUseCase implements ICreatePostBankTransactionsUseCase {
  constructor(
    @inject(IDwollaPreBankTransactionsRepositoryId)
    private dwollaPreBankTransactionRepository: IDwollaPreBankTransactionsRepository,
    @inject(IDwollaPostBankTransactionsRepositoryId)
    private dwollaPostBankTransactionsRepository: IDwollaPostBankTransactionsRepository,
    @inject(IIssuerRepositoryId) private issuerRepository: IIssuerRepository,
    @inject(IHoneycombDwollaCustomerRepositoryId)
    private honeycombDwollaCustomerRepository: IHoneycombDwollaCustomerRepository,
    @inject(IDwollaServiceId) private dwollaSerivce: IDwollaService,
    @inject(IIssuerBankRepositoryId) private issuerBankRepository: IIssuerBankRepository,
  ) {}

  async bankToWalletTransfer(dwollaPreBankTransaction, issuer, idempotencyId) {
    const dwollaBusinessCustomer = await this.honeycombDwollaCustomerRepository.fetchByIssuerId(
      issuer.issuerId,
    );
    const issuerBanks = await this.issuerBankRepository.fetchAllBanksByIssuerId(
      issuer.issuerId,
    );

    const issuerBank = issuerBanks.find((item) => item.isForRepayment === true);

    const dwollaSourceBalanceId = issuerBank.dwollaSourceId;
    const dwollaFee = await this.dwollaSerivce.createFee(
      dwollaPreBankTransaction.amount,
      dwollaBusinessCustomer.getDwollaCustomerId(),
    );

    return this.dwollaSerivce.createTransfer({
      sourceId: dwollaSourceBalanceId,
      destinationId: dwollaBusinessCustomer.getDwollaBalanceId(),
      amount: dwollaPreBankTransaction.amount,
      fee: dwollaFee,
      sameDayACH: false,
      idempotencyKey: idempotencyId,
    });
  }

  async execute(
    createPostBankTransactionsUseCaseDTO: CreatePostBankTransactionsUseCaseDTO,
  ) {
    const uploadId = createPostBankTransactionsUseCaseDTO.getUploadId();
    const dwollaPreBankTransactions = await this.dwollaPreBankTransactionRepository.fetchAllByUploadId(
      uploadId,
    );

    return async.eachSeries(
      dwollaPreBankTransactions,
      async (dwollaPreBankTransaction: any) => {
        let dwollaPostBankTransactionId = uuid();
        let idempotencyId = uuid();
        let transferId = '';

        const issuer = await this.issuerRepository.fetchOneByCustomCritera({
          whereConditions: { issuerName: dwollaPreBankTransaction.issuerName },
        });

        if (issuer) {
          const postBankTransactionInput = {
            dwollaPostBankTransactionId,
            source: dwollaPreBankTransaction.source,
            destination: dwollaPreBankTransaction.destination,
            status: 'pending',
            idempotencyId,
            dwollaTransferId: transferId,
            businessOwnerName: dwollaPreBankTransaction.businessOwnerName,
            businessOwnerEmail: dwollaPreBankTransaction.businessOwnerEmail,
            amount: dwollaPreBankTransaction.amount,
          };

          const dwollaPostBankTransactionObject = DwollaPostBankTransactions.createFromDetail(
            postBankTransactionInput,
          );
          dwollaPostBankTransactionObject.setIssuerId(issuer.issuerId);
          dwollaPostBankTransactionObject.setDwollaPreBankTransactionId(
            dwollaPreBankTransaction.dwollaPreBankTransactionId,
          );

          await this.dwollaPostBankTransactionsRepository.add(
            dwollaPostBankTransactionObject,
          );

          if (
            dwollaPreBankTransaction.source.toLowerCase() === 'bank' &&
            dwollaPreBankTransaction.destination.toLowerCase() === 'wallet'
          ) {
            transferId = await this.bankToWalletTransfer(
              dwollaPreBankTransaction,
              issuer,
              idempotencyId,
            );
          }

          const dwollaPostBankTransaction = await this.dwollaPostBankTransactionsRepository.fetchOneByCustomCritera(
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

            if (dwollaPostBankTransaction) {
              const input = {
                ...dwollaPostBankTransaction,
                dwollaTransferId: transferId,
              };
              await this.dwollaPostBankTransactionsRepository.update(input, {
                dwollaPostBankTransactionId:
                  dwollaPostBankTransaction.dwollaPostBankTransactionId,
              });
            }
          } else {
            await this.dwollaPostBankTransactionsRepository.remove(
              dwollaPostBankTransaction,
              true,
            );
          }
        }
      },
    );
  }
}

export default CreatePostBankTransactionsUseCase;
