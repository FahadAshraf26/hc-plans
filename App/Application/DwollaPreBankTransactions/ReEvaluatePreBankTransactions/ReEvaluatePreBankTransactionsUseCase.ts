import {
  IIssuerBankRepository,
  IIssuerBankRepositoryId,
} from '@domain/Core/IssuerBank/IIssuerBankRepository';
import {
  IDwollaPreBankTransactionsRepositoryId,
  IDwollaPreBankTransactionsRepository,
} from '@domain/Core/DwollaPreBankTransactions/IDwollaPreBankTransactionsRepository';
import { inject, injectable } from 'inversify';
import { IReEvaluatePreBankTransactionsUseCase } from './IReEvaluatePreBankTransactionsUseCase';
import ReEvaluatePreBankTransactionsDTO from './ReEvaluatePreBankTransactionsDTO';
import async from 'async';
import {
  IPreTransactionServiceId,
  IPreTransactionService,
} from '@domain/Services/IPreTransactionService';
import {
  IHoneycombDwollaBeneficialOwnerRepositoryId,
  IHoneycombDwollaBeneficialOwnerRepository,
} from '@domain/Core/HoneycombDwollaBeneficialOwner/IHoneycombDwollaBeneficialOwnerRepository';

@injectable()
class ReEvaluatePreBankTransactions implements IReEvaluatePreBankTransactionsUseCase {
  constructor(
    @inject(IDwollaPreBankTransactionsRepositoryId)
    private dwollaPreBankTransactionsRepository: IDwollaPreBankTransactionsRepository,
    @inject(IPreTransactionServiceId)
    private dwollaPreBankTransactionService: IPreTransactionService,
    @inject(IHoneycombDwollaBeneficialOwnerRepositoryId)
    private dwollaBeneficialOwnerRepository: IHoneycombDwollaBeneficialOwnerRepository,
    @inject(IIssuerBankRepositoryId) private issuerBankRepository: IIssuerBankRepository,
  ) {}

  async execute(reEvaluatePreBankTransactionsDTO: ReEvaluatePreBankTransactionsDTO) {
    const uploadId = reEvaluatePreBankTransactionsDTO.getUploadId();
    const preBankTransactions = await this.dwollaPreBankTransactionsRepository.fetchAllByUploadId(
      uploadId,
    );

    return async.eachSeries(preBankTransactions, async (preBankTransaction: any) => {
      preBankTransaction.status = 'success';
      preBankTransaction.errorMessage;

      const issuer = await this.dwollaPreBankTransactionService.validateIssuerName(
        preBankTransaction.issuerName,
      );

      if (issuer === null) {
        preBankTransaction.errorMessage = `${preBankTransaction.issuerName} is not a valid Business name`;
        preBankTransaction.status = 'failed';
      }

      if (preBankTransaction.source.toLowerCase() === 'bank') {
      } else {
        preBankTransaction.errorMessage = `From column must be 'Bank' or 'bank'`;
        preBankTransaction.status = 'failed';
      }

      if (preBankTransaction.destination.toLowerCase() === 'wallet') {
      } else if (preBankTransaction.destination.toLowerCase() === 'custody') {
      } else {
        preBankTransaction.errorMessage = `To column must be 'Wallet' or 'wallet' or 'Custody' or 'custody'`;
        preBankTransaction.status = 'failed';
      }

      if (issuer !== null) {
        const dwollaBusinessCustomer = await this.dwollaPreBankTransactionService.validateHoneycombDwollaBsuinessCustomer(
          issuer,
        );
        if (dwollaBusinessCustomer === null) {
          preBankTransaction.errorMessage = `${preBankTransaction.issuerName} does not have dwolla business customer`;
          preBankTransaction.status = 'failed';
        }
        if (dwollaBusinessCustomer) {
          if (issuer.getLegalEntityType() !== 'soleProprietorShip') {
            const businessCustomerBeneficialOwner = await this.dwollaBeneficialOwnerRepository.fetchByDwollaCustomerId(
              dwollaBusinessCustomer.getDwollaCustomerId(),
            );

            if (businessCustomerBeneficialOwner === null) {
              preBankTransaction.errorMessage = `${preBankTransaction.issuerName} does not have dwolla business customer beneficial owner`;
              preBankTransaction.status = 'failed';
            }
          }

          if (
            dwollaBusinessCustomer.getDwollaBalanceId() === null ||
            dwollaBusinessCustomer.getDwollaBalanceId() === ''
          ) {
            preBankTransaction.errorMessage = `${preBankTransaction.issuerName} does not have dwolla wallet Id`;
            preBankTransaction.status = 'failed';
          }
        }

        const issuerBanks = await this.issuerBankRepository.fetchAllBanksByIssuerId(
          issuer.issuerId,
        );
        if (issuerBanks) {
          const prefferedAccount = issuerBanks.find(
            (item) => item.isForRepayment === true,
          );
          if (!prefferedAccount) {
            preBankTransaction.errorMessage = `${preBankTransaction.issuerName} does not have prefered bank account`;
            preBankTransaction.status = 'failed';
          }

          if (
            prefferedAccount &&
            (!prefferedAccount.dwollaSourceId ||
              prefferedAccount.dwollaSourceId.trim() === '')
          ) {
            preBankTransaction.errorMessage = `${preBankTransaction.issuerName} does not have dwolla funding source Id`;
            preBankTransaction.status = 'failed';
          }
        }
      }
      await this.dwollaPreBankTransactionsRepository.update(preBankTransaction, {
        dwollaPreBankTransactionId: preBankTransaction.dwollaPreBankTransactionId,
      });
    });
  }
}

export default ReEvaluatePreBankTransactions;
