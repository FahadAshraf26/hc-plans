import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import async from 'async';
import container from '@infrastructure/DIContainer/container';
import {
  IHybridTransactionRepoistory,
  IHybridTransactionRepoistoryId,
} from '@domain/Core/HybridTransactions/IHybridTransactionRepository';
import logger from '@infrastructure/Logger/logger';
import moment from 'moment';
import EncryptionService from '@infrastructure/Service/EncryptionService/EncryptionService';
import {
  INachaService,
  INachaServiceId,
} from '@infrastructure/Service/Nacha/INachaService';
import {
  IChargeRepository,
  IChargeRepositoryId,
} from '@domain/Core/Charge/IChargeRepository';
import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import { ISftpService, ISftpServiceId } from '@infrastructure/Service/SFTP/ISftpService';
import mailService from '@infrastructure/Service/MailService';
import Config from '@infrastructure/Config';
import nachaFileUploadEmailTemplate from '@domain/Utils/EmailTemplates/nachaFileUploadEmailTemplate';
import {
  IStorageService,
  IStorageServiceId,
} from '@infrastructure/Service/StorageService/IStorageService';
import getYearMonthDayDirectoryRoutesForNachaFiles from '@infrastructure/Utils/getYearMonthDayDirectoryRoutes';
import dollarFormatter from '@infrastructure/Utils/dollarFormatter';
import TransactionType from '@domain/Core/CampaignFunds/TransactionType';
import CampaignFund from '@domain/Core/CampaignFunds/CampaignFund';
const { threadBankConfig } = Config;

const hybridTransactionRepoistory = container.get<IHybridTransactionRepoistory>(
  IHybridTransactionRepoistoryId,
);
const chargeRepository = container.get<IChargeRepository>(IChargeRepositoryId);
const campaignFundRepository = container.get<ICampaignFundRepository>(
  ICampaignFundRepositoryId,
);

const nachaService = container.get<INachaService>(INachaServiceId);
const sftpService = container.get<ISftpService>(ISftpServiceId);
const storageService = container.get<IStorageService>(IStorageServiceId);

const { SendHtmlEmail } = mailService;

export const CreateNachaFileForRefund = async () => {
  try {
    const investors = [];
    const hybridTransactions = await hybridTransactionRepoistory.fetchAllAchThreadBankPendingRefundTransactions();
    let totalAmount = 0;
    let nachaFileName = `Honeycomb-${moment().format('YYYY-MM-DD')}`;

    await async.eachSeries(hybridTransactions, async (hybridTransaction: any) => {
      if (hybridTransaction.campaignFund.campaignInvestor.investorBank[0]) {
        totalAmount =
          totalAmount +
          hybridTransaction.amount +
          roundToTwoDecimals(
            hybridTransaction.applicationFee ? hybridTransaction.applicationFee : 0,
          );
        const investor = {
          amount:
            hybridTransaction.amount +
            roundToTwoDecimals(hybridTransaction.applicationFee),
          firstName: hybridTransaction.campaignFund.campaignInvestor.user.firstName,
          lastName: hybridTransaction.campaignFund.campaignInvestor.user.lastName,
          accountNumber: EncryptionService.decryptBankDetails(
            hybridTransaction.campaignFund.campaignInvestor.investorBank[0].bank
              .accountNumber,
          ),
          routingNumber: EncryptionService.decryptBankDetails(
            hybridTransaction.campaignFund.campaignInvestor.investorBank[0].bank
              .routingNumber,
          ),
        };

        if (hybridTransaction.campaignFund.campaignFundId) {
          investors.push(investor);
        }
      }
    });

    logger.debug('**********', totalAmount);

    if (totalAmount > 0) {
      const nachaFilePath = await nachaService.createNachaFile(investors, nachaFileName);

      const sftpPath = await sftpService.uploadFile(nachaFilePath.filePath);
      let tableContent: string = '';
      investors.map((investor) => {
        tableContent += `<tr>
          <td style="border: 1px solid black; padding: 8px; text-align: center;">${
            investor.firstName
          } ${investor.lastName}</td>
          <td style="border: 1px solid black; padding: 8px; text-align: center;">$${dollarFormatter.format(
            investor.amount,
          )}</td>
        </tr>`;
      });
      

      const recordKeepingEmails = threadBankConfig.RECORD_KEEPING_EMAILS.split(',');

      const html = nachaFileUploadEmailTemplate
        .replace('{$folderPath}', `${sftpPath}`)
        .replace('{$totalAmount}', `$${dollarFormatter.format(totalAmount)}`)
        .replace('{$tableContent}', `${tableContent}`);

      await SendHtmlEmail(
        threadBankConfig.EMAIL,
        'Refund Transmittal Request - Honeycomb Credit',
        html,
        undefined,
        undefined,
        recordKeepingEmails,
      );

      await async.eachSeries(hybridTransactions, async (hybridTransaction: any) => {
        if (hybridTransaction.campaignFund.campaignInvestor.investorBank[0]) {
          const campaignFund = await campaignFundRepository.fetchById(
            hybridTransaction.campaignFund.campaignFundId,
          );
          if (campaignFund) {
            await updateTransactionStatus(hybridTransaction, campaignFund, nachaFileName);
          }
        }
      });

      const { remoteFilePath } = getYearMonthDayDirectoryRoutesForNachaFiles(
        sftpPath,
        'GCP',
      );
      const localFilePath = path.resolve(nachaFilePath.filePath);
      await storageService.uploadPdfFile(localFilePath, remoteFilePath);
    }

    logger.debug(`Total Amount: ${totalAmount}`);
  } catch (error) {
    logger.error(error);
  }
};

const updateTransactionStatus = async (
  hybridTransaction: any,
  campaignFund: CampaignFund,
  nachaFileName: string,
) => {
  const charge = campaignFund.Charge();
  const status =
    hybridTransaction.transactionType === TransactionType.ACH().getValue()
      ? ChargeStatus.REFUND_PROCESSING
      : hybridTransaction.debitAuthorizationId
      ? hybridTransaction.status
      : ChargeStatus.REFUND_PROCESSING;

  await hybridTransactionRepoistory.updateStatusAndNachaFileName(
    hybridTransaction.hybridTransactionId,
    status,
    nachaFileName,
  );

  charge.setChargeStatus(ChargeStatus.REFUND_PROCESSING);
  await chargeRepository.update(charge);
};

const roundToTwoDecimals = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};
