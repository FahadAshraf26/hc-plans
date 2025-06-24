import {
  IInvestorPaymentOptionsRepositoryId,
  IInvestorPaymentOptionsRepository,
} from '@domain/InvestorPaymentOptions/IInvestorPaymentOptionsRepository';
import {
  IIssuerBankRepositoryId,
  IIssuerBankRepository,
} from '@domain/Core/IssuerBank/IIssuerBankRepository';
import {
  IDwollaPreTransactionsRepositoryId,
  IDwollaPreTransactionsRepository,
} from '@domain/Core/DwollaPreTransactions/IDwollaPreTransactionsRepository';
import {
  IPreTransactionServiceId,
  IPreTransactionService,
} from '@domain/Services/IPreTransactionService';
import { inject, injectable } from 'inversify';
import { IReEvaluatePreTransactionsUseCase } from './IReEvaluatePreTransactionsUseCase';
import ReEvaluatePreTransactionsDTO from './ReEvaluatePreTransactionsDTO';
import {
  IHoneycombDwollaBeneficialOwnerRepositoryId,
  IHoneycombDwollaBeneficialOwnerRepository,
} from '@domain/Core/HoneycombDwollaBeneficialOwner/IHoneycombDwollaBeneficialOwnerRepository';
import { CampaignStage } from '@domain/Core/ValueObjects/CampaignStage';

@injectable()
class ReEvaluatePreTransactionsUseCase implements IReEvaluatePreTransactionsUseCase {
  constructor(
    @inject(IPreTransactionServiceId)
    private dwollaPreTransactionDomainService: IPreTransactionService,
    @inject(IDwollaPreTransactionsRepositoryId)
    private dwollaPreTransactionRepository: IDwollaPreTransactionsRepository,
    @inject(IHoneycombDwollaBeneficialOwnerRepositoryId)
    private dwollaBeneficialOwnerRepository: IHoneycombDwollaBeneficialOwnerRepository,
    @inject(IIssuerBankRepositoryId) private issuerBankRepository: IIssuerBankRepository,
    @inject(IInvestorPaymentOptionsRepositoryId)
    private investorPaymentOptionsRepository: IInvestorPaymentOptionsRepository,
  ) {}

  async reEvaluatePreTransactions(
    reEvaluatePreTransactionsDTO: ReEvaluatePreTransactionsDTO,
  ) {
    const uploadId = reEvaluatePreTransactionsDTO.getUploadId();
    const preTransactions = await this.dwollaPreTransactionRepository.fetchAllByUploadId(
      uploadId,
    );

    const [response] = await Promise.all(
      preTransactions.map(async (preTransaction) => {
        preTransaction.status = 'success';
        preTransaction.errorMessage = [];

        preTransaction.interestPaid = parseFloat(preTransaction.interestPaid);
        preTransaction.principalPaid = parseFloat(preTransaction.principalPaid);

        const campaign = await this.dwollaPreTransactionDomainService.validateCampaign(
          preTransaction.campaignName,
        );
        const user = await this.dwollaPreTransactionDomainService.validateInvestor(
          preTransaction.investorEmail,
        );

        const issuer = await this.dwollaPreTransactionDomainService.validateIssuer(
          preTransaction.issuerEmail,
        );

        const dwollaPersonalCustomer = await this.dwollaPreTransactionDomainService.validateHoneycombDwollaPersonalCustomer(
          user,
        );

        if (campaign === null) {
          preTransaction.errorMessage.push(
            `${preTransaction.campaignName} is not a valid campaign`,
          );
          preTransaction.status = 'failed';
        }

        if (user === null) {
          preTransaction.errorMessage.push(
            `${preTransaction.investorEmail} is not a valid investor email`,
          );
          preTransaction.status = 'failed';
        }

        if (issuer === null) {
          preTransaction.errorMessage.push(
            `${preTransaction.issuerEmail} is not a valid issuer email`,
          );
          preTransaction.status = 'failed';
        }

        if (dwollaPersonalCustomer === null) {
          preTransaction.errorMessage.push(
            `${preTransaction.issuerEmail} does not have dwolla personal customer`,
          );
          preTransaction.status = 'failed';
        }

        if (
          preTransaction.source.toLowerCase() === 'bank' ||
          preTransaction.source.toLowerCase() === 'wallet'
        ) {
        } else {
          const fromMessage = `From column must be 'Bank' or 'bank' or 'Wallet' or 'wallet`;
          preTransaction.errorMessage.push(fromMessage);
          preTransaction.status = 'failed';
        }

        if (
          preTransaction.destination.toLowerCase() === 'bank' ||
          preTransaction.destination.toLowerCase() === 'wallet'
        ) {
        } else {
          const toMessage = `To column must be 'Bank' or 'bank' or 'Wallet' or 'wallet`;
          preTransaction.errorMessage.push(toMessage);
          preTransaction.status = 'failed';
        }

        if (preTransaction.interestPaid < 0) {
          preTransaction.errorMessage.push(`Interest Paid must be positive number`);
          preTransaction.status = 'failed';
        }

        if (preTransaction.principalPaid < 0) {
          preTransaction.errorMessage.push(`Principal Paid must be positive number`);
          preTransaction.status = 'failed';
        }

        if (
          preTransaction.destination.toLowerCase() === 'bank'
        ) {
          if (dwollaPersonalCustomer !== null) {
            const investorBank = await this.investorPaymentOptionsRepository.fetchInvestorBank(
              user.investor.investorId,
            );
            const bank = investorBank.getBank();
            if (bank.getDwollaFundingSourceId() === null) {

              preTransaction.errorMessage.push(
                `${user.email} does not have any bank attach with dwolla`,
              );
              preTransaction.status = 'failed';
            }
          }
        }

        preTransaction.total =
          parseFloat(preTransaction.interestPaid) +
          parseFloat(preTransaction.principalPaid);
        if (campaign !== null && user !== null) {
          if (
            campaign.campaignStage === CampaignStage.FUNDED ||
            campaign.campaignStage === CampaignStage.EARLY_COMPLETE ||
            campaign.campaignStage === CampaignStage.FULLY_REPAID ||
            campaign.campaignStage === CampaignStage.NOT_FUNDED
          ) {
          } else {
            preTransaction.errorMessage.push(
              `${preTransaction.campaignName} is not completed yet`,
            );
            preTransaction.status = 'failed';
          }
          const campaignFund = await this.dwollaPreTransactionDomainService.validateCampaignInvestorFund(
            campaign,
            user.investor,
          );

          if (campaignFund === null) {
            preTransaction.errorMessage.push(
              `No investment found for ${preTransaction.investorEmail} in ${preTransaction.campaignName} campaign`,
            );
            preTransaction.status = 'failed';
          }
          if (
            preTransaction.entityName !== null &&
            Object.keys(preTransaction.entityName).length > 0
          ) {
            const entity = await this.dwollaPreTransactionDomainService.validateEntity(
              preTransaction.entityName,
            );
            if (entity === null) {
              preTransaction.errorMessage.push(
                `${preTransaction.entityName} is not a valid entity`,
              );
              preTransaction.status = 'failed';
            }
            if (entity) {
              const entityCampaignFund = await this.dwollaPreTransactionDomainService.validateCampaignEntityFund(
                campaign,
                entity,
              );

              if (entityCampaignFund === null) {
                preTransaction.errorMessage.push(
                  `No investment found for ${preTransaction.entityName} in ${preTransaction.campaignName} campaign`,
                );
                preTransaction.status = 'failed';
              }
            }
          } else if (issuer !== null) {
            const dwollaBusinessCustomer = await this.dwollaPreTransactionDomainService.validateHoneycombDwollaBsuinessCustomer(
              issuer,
            );
            if (dwollaBusinessCustomer === null) {
              preTransaction.errorMessage.push(
                `${preTransaction.issuerEmail} does not have dwolla business customer`,
              );
              preTransaction.status = 'failed';
            }

            if (
              dwollaBusinessCustomer &&
              issuer.getLegalEntityType() !== 'soleProprietorShip'
            ) {
              const businessCustomerBeneficialOwner = await this.dwollaBeneficialOwnerRepository.fetchByDwollaCustomerId(
                dwollaBusinessCustomer.getDwollaCustomerId(),
              );

              if (businessCustomerBeneficialOwner === null) {
                preTransaction.errorMessage.push(
                  `${preTransaction.issuerEmail} does not have dwolla business customer beneficial owner`,
                );
                preTransaction.status = 'failed';
              }
            }
            if (preTransaction.source.toLowerCase() === 'bank') {
              const issuerBanks = await this.issuerBankRepository.fetchAllBanksByIssuerId(
                issuer.issuerId,
              );

              if (issuerBanks) {
                const preferredAccount = issuerBanks.find(
                  (item) => item.isForRepayment === true,
                );
                if (!preferredAccount) {
                  preTransaction.errorMessage.push(
                    `${preTransaction.issuerEmail} does not have preffered bank account`,
                  );
                  preTransaction.status = 'failed';
                } else if (preferredAccount.dwollaSourceId === null) {
                  preTransaction.errorMessage.push(
                    `${preTransaction.issuerEmail} does not have bank attached with dwolla business customer`,
                  );
                  preTransaction.status = 'failed';
                }
              }
            }
          } else if (user !== null) {
            if (dwollaPersonalCustomer === null) {
              preTransaction.errorMessage.push(
                `${preTransaction.investorEmail} does not have dwolla personal customer`,
              );
              preTransaction.status = 'failed';
            }
          } else {
            if (
              campaign !== null &&
              user !== null &&
              issuer !== null &&
              campaignFund !== null
            ) {
              preTransaction.status = 'success';
            }
          }
        }

        return this.dwollaPreTransactionRepository.update(preTransaction, {
          uploadId: preTransaction.uploadId,
        });
      }),
    );

    return response;
  }
}

export default ReEvaluatePreTransactionsUseCase;
