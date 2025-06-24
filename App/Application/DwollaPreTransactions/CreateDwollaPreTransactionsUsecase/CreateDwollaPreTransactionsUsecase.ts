import logger from '@infrastructure/Logger/logger';
import {
  IInvestorPaymentOptionsRepositoryId,
  IInvestorPaymentOptionsRepository,
} from '@domain/InvestorPaymentOptions/IInvestorPaymentOptionsRepository';
import { CampaignStage } from '@domain/Core/ValueObjects/CampaignStage';
import {
  IIssuerBankRepository,
  IIssuerBankRepositoryId,
} from '@domain/Core/IssuerBank/IIssuerBankRepository';
import {
  IHoneycombDwollaBeneficialOwnerRepositoryId,
  IHoneycombDwollaBeneficialOwnerRepository,
} from '@domain/Core/HoneycombDwollaBeneficialOwner/IHoneycombDwollaBeneficialOwnerRepository';
import {
  IPreTransactionServiceId,
  IPreTransactionService,
} from '@domain/Services/IPreTransactionService';
import { ICreateDwollaPreTransactionsUsecase } from './ICreateDwollaPreTransactionsUsecase';
import {
  IDwollaPreTransactionsRepositoryId,
  IDwollaPreTransactionsRepository,
} from '@domain/Core/DwollaPreTransactions/IDwollaPreTransactionsRepository';
import { inject, injectable } from 'inversify';
import CreateDwollaPreTransactionDTO from './CreateDwollaPreTransactionsDTO';
import fs from 'fs';
import path from 'path';
import * as csv from 'fast-csv';
import CSVHeaders from '@domain/Core/ValueObjects/PreTransactionsCSVHeaders';
import DwollaPreTransactions from '@domain/Core/DwollaPreTransactions/DwollaPreTransactions';
import uuid from 'uuid/v4';
import async from 'async';
import {
  ISlackService,
  ISlackServiceId,
} from '@infrastructure/Service/Slack/ISlackService';
import config from '@infrastructure/Config';
const { slackConfig } = config;
@injectable()
class CreateDwollaPreTransactionsUsecase implements ICreateDwollaPreTransactionsUsecase {
  constructor(
    @inject(IDwollaPreTransactionsRepositoryId)
    private dwollaPreTransactionsRepository: IDwollaPreTransactionsRepository,
    @inject(IPreTransactionServiceId)
    private dwollaPreTransactionDomainService: IPreTransactionService,
    @inject(IHoneycombDwollaBeneficialOwnerRepositoryId)
    private dwollaBeneficialOwnerRepository: IHoneycombDwollaBeneficialOwnerRepository,
    @inject(IIssuerBankRepositoryId) private issuerBankRepository: IIssuerBankRepository,
    @inject(IInvestorPaymentOptionsRepositoryId)
    private investorPaymentOptionsRepository: IInvestorPaymentOptionsRepository,
    @inject(ISlackServiceId) private slackService: ISlackService,
  ) {}

  async parseCsv(file) {
    return new Promise((resolve, reject) => {
      const dataRows = [];
      const csvStream = fs.createReadStream(
        path.resolve(__dirname, `../../../../Storage`, file.filename),
      );
      csv
        .parseStream(csvStream, { headers: true })

        .on('headers', function (headers) {
          if (JSON.stringify(headers) !== JSON.stringify(CSVHeaders)) {
            resolve({ status: 'error', message: 'Headers does not match' });
          }
        })
        .on('data', async (data) => {
          dataRows.push(data);
        })
        .on('error', function (e) {
          resolve({ status: 'error', message: e });
        })
        .on('end', function () {
          resolve({ status: 'success', dataRows: dataRows });
          const pdfFileStream = path.resolve(
            __dirname,
            `../../../../Storage`,
            file.filename,
          );
          fs.unlink(pdfFileStream, (err) => {
            logger.error(err);
          });
        });
    });
  }

  async importData(dataRows, fileName) {
    const uploadId = uuid();

    return async.eachSeries(dataRows, async (data) => {
      let recordStatus = 'success';
      let errorMessage = [];
      let interestPaid =
        data['Interest paid'] === '' ? 0 : parseFloat(data['Interest paid']);
      let principalPaid =
        data['Principal paid'] === '' ? 0 : parseFloat(data['Principal paid']);
      if (Number.isNaN(interestPaid) || Number.isNaN(principalPaid)) {
        throw new Error('File Data is not valid');
      }
      const issuer = await this.dwollaPreTransactionDomainService.validateIssuer(
        data['Issuer email'],
      );
      const campaign = await this.dwollaPreTransactionDomainService.validateCampaign(
        data['Campaign name'],
      );

      const user = await this.dwollaPreTransactionDomainService.validateInvestor(
        data['Investor email'],
      );

      const dwollaPersonalCustomer = await this.dwollaPreTransactionDomainService.validateHoneycombDwollaPersonalCustomer(
        user,
      );

      if (dwollaPersonalCustomer === null) {
        errorMessage.push(
          `${data['Investor email']} does not have dwolla personal customer`,
        );
        recordStatus = 'failed';
      }

      if (data['From'].toLowerCase() === 'bank') {
      } else if (data['From'].toLowerCase() === 'wallet') {
      } else {
        errorMessage.push(`From column must be 'Bank' or 'bank' or 'Wallet' or 'wallet`);
        recordStatus = 'failed';
      }

      if (data['To'].toLowerCase() === 'bank') {
        if (dwollaPersonalCustomer !== null && user !== null) {
          const investorBank = await this.investorPaymentOptionsRepository.fetchInvestorBank(
            user.investor.investorId,
          );
          if (investorBank) {
            const bank = investorBank.getBank();
            if (bank.getDwollaFundingSourceId() === null) {
              errorMessage.push(
                `${user.email} does not have any bank attach with dwolla`,
              );
              recordStatus = 'failed';
              this.slackService.publishMessage({
                message: `*${user.email}* does not have any bank attach with dwolla`,
                slackChannelId: slackConfig.DWOLLA_ACTIVITY.ID,
              });
            }
          } else {
            errorMessage.push(`${user.email} does not have any bank attach with dwolla`);
            recordStatus = 'failed';
            this.slackService.publishMessage({
              message: `*${user.email}* does not have any bank attach with dwolla`,
              slackChannelId: slackConfig.DWOLLA_ACTIVITY.ID,
            });
          }
        }
      } else if (data['To'].toLowerCase() === 'wallet') {
      } else {
        errorMessage.push(`To column must be 'Bank' or 'bank' or 'Wallet' or 'wallet`);
        recordStatus = 'failed';
      }

      if (interestPaid < 0) {
        errorMessage.push(`Interest Paid must be positive number`);
        recordStatus = 'failed';
      }

      if (principalPaid < 0) {
        errorMessage.push(`Principal Paid must be positive number`);
        recordStatus = 'failed';
      }

      if (campaign !== null && user !== null && issuer !== null) {
        if (
          campaign.campaignStage === CampaignStage.FUNDED ||
          campaign.campaignStage === CampaignStage.EARLY_COMPLETE ||
          campaign.campaignStage === CampaignStage.FULLY_REPAID ||
          campaign.campaignStage === CampaignStage.NOT_FUNDED
        ) {
        } else {
          errorMessage.push(`${data['Campaign name']} is not completed yet`);
          recordStatus = 'failed';
        }
        const issuerCampaigns = await this.dwollaPreTransactionDomainService.validateIssuerCampaigns(
          issuer.issuerId,
        );
        const isIssuerCampaign = issuerCampaigns.find(
          (item) => (item.campaignName = campaign.campaignName),
        );

        if (!isIssuerCampaign) {
          errorMessage.push(
            `${data['Campaign name']} is not associate with this ${data['Issuer email']}`,
          );
          recordStatus = 'failed';
        }

        const dwollaBusinessCustomer = await this.dwollaPreTransactionDomainService.validateHoneycombDwollaBsuinessCustomer(
          issuer,
        );

        if (dwollaBusinessCustomer === null) {
          errorMessage.push(
            `${data['Issuer email']} does not have dwolla business customer`,
          );
          recordStatus = 'failed';
        }
        if (data['From'].toLowerCase() === 'bank') {
          const issuerBanks = await this.issuerBankRepository.fetchAllBanksByIssuerId(
            issuer.issuerId,
          );

          if (issuerBanks) {
            const preferredAccount = issuerBanks.find(
              (item) => item.isForRepayment === true,
            );
            if (!preferredAccount) {
              errorMessage.push(
                `${data['Issuer email']} does not have preffered bank account`,
              );
              recordStatus = 'failed';
            } else if (preferredAccount.dwollaSourceId === null) {
              errorMessage.push(
                `${data['Issuer email']} does not have bank attached with dwolla business customer`,
              );
              recordStatus = 'failed';
            }
          }
        }

        if (data['From'].toLowerCase() === 'wallet') {
          if (!dwollaBusinessCustomer.getDwollaBalanceId()) {
            errorMessage.push(`${data['Issuer email']} does not have wallet balance Id`);
            recordStatus = 'failed';
          }
        }

        if (
          dwollaBusinessCustomer &&
          issuer.getLegalEntityType() !== 'soleProprietorShip'
        ) {
          const businessCustomerBeneficialOwner = await this.dwollaBeneficialOwnerRepository.fetchByDwollaCustomerId(
            dwollaBusinessCustomer.getDwollaCustomerId(),
          );

          if (businessCustomerBeneficialOwner === null) {
            errorMessage.push(
              `${data['Issuer email']} does not have dwolla business customer beneficial owner`,
            );
            recordStatus = 'failed';
          }
        }

        const campaignFund = await this.dwollaPreTransactionDomainService.validateCampaignInvestorFund(
          campaign,
          user.investor,
        );
        if (campaignFund === null) {
          errorMessage.push(
            `No investment found for ${data['Investor email']} in ${data['Campaign name']} campaign`,
          );
          recordStatus = 'failed';
        }

        if (Object.keys(data['Entity name']).length > 0) {
          const entity = await this.dwollaPreTransactionDomainService.validateEntity(
            data['Entity name'],
          );
          if (entity === null) {
            errorMessage.push(`${data['Entity name']} is not a valid entity`);
            recordStatus = 'failed';
          }

          if (entity) {
            const entityCampaignFund = await this.dwollaPreTransactionDomainService.validateCampaignEntityFund(
              campaign,
              entity,
            );

            if (entityCampaignFund === null) {
              errorMessage.push(
                `No investment found for ${data['Entity name']} in ${data['Campaign name']} campaign`,
              );
              recordStatus = 'failed';
            }
          }
        }
      } else {
        if (issuer === null) {
          errorMessage.push(`${data['Issuer email']} is not valid business email`);
          recordStatus = 'failed';
        }
        if (campaign === null) {
          errorMessage.push(`${data['Campaign name']} is not valid campaign`);
          recordStatus = 'failed';
        }
        if (user === null) {
          errorMessage.push(`${data['Investor email']} is not a valid investor email`);
          recordStatus = 'failed';
        }
      }

      const dwollaPreTransactionData = {
        source: data['From'],
        destination: data['To'],
        interestPaid,
        principalPaid,
        total: interestPaid + principalPaid,
        status: recordStatus,
        issuerName: data['Issuer (business name)'],
        campaignName: data['Campaign name'],
        issuerEmail: data['Issuer email'],
        investorName: data['Investor name'],
        investorEmail: data['Investor email'],
        investorType: data['Investor type'],
        entityName:
          Object.keys(data['Entity name']).length > 0 ? data['Entity name'] : null,
        uploadId,
        errorMessage: recordStatus === 'failed' ? errorMessage : '',
        fileName,
      };
      const dwollaPreTransactions = DwollaPreTransactions.createFromDetail(
        dwollaPreTransactionData,
      );

      await this.dwollaPreTransactionsRepository.add(dwollaPreTransactions);
    });
  }

  async execute(
    createDwollaPreTransactionDTO: CreateDwollaPreTransactionDTO,
  ): Promise<any> {
    const preTransactions = await this.dwollaPreTransactionsRepository.fetchAllLatestPreTransactions();

    if (preTransactions.dwollaPreTransactions.length > 0) {
      throw new Error("Can't import data, there is already data in the system");
    }

    const file = createDwollaPreTransactionDTO.getFile();
    const response = await this.parseCsv(file);

    if (response['status'] === 'success' && response['dataRows'].length > 0) {
      await this.importData(response['dataRows'], file.originalname);
    }
    if (response['status'] === 'error') {
      return response;
    } else if (response['status'] === 'success' && response['dataRows'].length === 0) {
      return { status: 'success', message: 'No Data found in the file' };
    } else {
      return { status: 'success', message: 'File upload successfully' };
    }
  }
}

export default CreateDwollaPreTransactionsUsecase;
