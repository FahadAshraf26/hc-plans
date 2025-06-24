import async from 'async';
import path from "path";
import fs from 'fs';
import {
  ISlackService,
  ISlackServiceId,
} from './../../Infrastructure/Service/Slack/ISlackService';
import { inject, injectable } from 'inversify';
import config from '@infrastructure/Config';
import { IHybridTransactionRepoistory, IHybridTransactionRepoistoryId } from '@domain/Core/HybridTransactions/IHybridTransactionRepository';
import EncryptionService from '@infrastructure/Service/EncryptionService/EncryptionService';
import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import EmailTemplates from '@domain/Utils/EmailTemplates';
import MailService from '@infrastructure/Service/MailService';
import { IChargeRepository, IChargeRepositoryId } from '@domain/Core/Charge/IChargeRepository';
import UpdateRefundStatusDTO from '@application/Refunds/UpdateRefundsStatusDTO';
import * as csv from 'fast-csv';
import logger from '@infrastructure/Logger/logger';
import HybridTransaction from '@domain/Core/HybridTransactions/HybridTransaction';

const { slackConfig } = config;
const { SendHtmlEmail } = MailService;
const { updateACHRefundStatusErrorEmailTemplate } = EmailTemplates;
const PROCESSED = "Processed";

@injectable()
class UpdateAchRefundStatusUseCase {
  constructor(
    @inject(IHybridTransactionRepoistoryId) private hybridTransactionRepository: IHybridTransactionRepoistory,
    @inject(IChargeRepositoryId) private chargeRepository: IChargeRepository,
    @inject(ISlackServiceId) private slackService: ISlackService,
  ) { }

  async execute(updateRefundStatusDto: UpdateRefundStatusDTO) {
    const { file, email: userEmail } = updateRefundStatusDto;
    const refundStatus: any = await this.parseCsv(file);
    if (refundStatus.status !== ChargeStatus.SUCCESS) {
      throw new Error("Error occured while parsing the file.");
    }

    const uniqueNachaFileNames: string[] = Array.from(new Set(refundStatus.dataRows.map(item => item["Transfer Description"].replace(/\.txt$/, ''))));
    if (!uniqueNachaFileNames) {
      throw new Error("Nacha file names not found in the file.");
    }

    let updateFlag: boolean = false;
    let errorFlag: boolean = false;
    const outputFilePath = path.resolve('Storage/UpdateACHRefundStatusErrorsFile.csv');
    this.createHeaderForErrorFile(outputFilePath);
    let hybridTransaction: HybridTransaction[];
    hybridTransaction = await this.hybridTransactionRepository.fetchAllByNachaFileNameForAchRefundStatus(uniqueNachaFileNames);
    if (hybridTransaction.length == 0) {
      throw new Error("Hybrid transactions not found for these entries");
    }

    await async.eachSeries(refundStatus.dataRows, async (refund) => {
      await async.someSeries(hybridTransaction, async (transaction) => {
        const investor = transaction.campaignFund.campaignInvestor;
        const bank = transaction.campaignFund.campaignInvestor.investorBank[0].bank;
        const charge = transaction.campaignFund.charge;
        if (refund["Recipient Name"] === `${investor.user.firstName} ${investor.user.lastName}` && refund["Amount"] == transaction.amount) {
          const accountNumber = EncryptionService.decryptBankDetails(bank.accountNumber);
          const routingNumber = EncryptionService.decryptBankDetails(bank.routingNumber);
          if (accountNumber === refund["Recipient Account"] && routingNumber === refund["Recipient ABA"] && refund["Status"] === PROCESSED && !transaction.isProcessed) {
            await this.hybridTransactionRepository.update({ hybridTransactionId: transaction.hybridTransactionId, status: ChargeStatus.REFUNDED, achRefunded: true });
            await this.chargeRepository.update({ chargeId: charge.chargeId, chargeStatus: ChargeStatus.REFUNDED });
            transaction.isProcessed = true;
            updateFlag = true;
            return true;
          }
        }
      })
      if(!updateFlag){
        this.writeToErrorFile(outputFilePath, refund, "Hybrid transaction not found for this entry");
        errorFlag = true;
      } else{
        updateFlag = false;
      }
    });

    if (errorFlag) {
      this.slackService.publishMessage({
        message: "Found some errors while updating Ach refund status, please check your mail for the error file.",
        slackChannelId: slackConfig.EMPLOYEE_ACTIVITY.ID,
      });

      await SendHtmlEmail(
        userEmail,
        "ACH Refund status Update Error Notifications",
        updateACHRefundStatusErrorEmailTemplate,
        [
          { filename: "ErrorFile.csv", content: fs.createReadStream(outputFilePath) }
        ],
      )
      fs.unlinkSync(outputFilePath);
    } else {
      this.slackService.publishMessage({
        message: "Ach refund status updated successfully.",
        slackChannelId: slackConfig.EMPLOYEE_ACTIVITY.ID,
      });
    }
  };

  async getACHRefundStatusUpdateHistory() {
    let hybridTransactions = await this.hybridTransactionRepository.getAchRefundStatusUpdate();

    hybridTransactions = hybridTransactions.map((transaction) => {
      return {
        hybridTransactionId: transaction.hybridTransactionId,
        nachaFileName: transaction.nachaFileName,
        date: transaction.updatedAt,
        name: `${transaction["campaignFund.campaignInvestor.user.firstName"]} ${transaction["campaignFund.campaignInvestor.user.lastName"]}`,
        amount: transaction.amount,
        status: transaction.status,
        transactionType: transaction.transactionType,
        source: transaction.source
      }
    })

    return hybridTransactions;
  }

  createHeaderForErrorFile = (outputFilePath: string) => {
    fs.writeFileSync(
      outputFilePath,
      `Error, Transfer Description, Batch Number, Company Name, SEC Code, Effective Date, Status, ACHTyp, Recipient Name, Recipient Account, Recipient Account Type, Recipient ABA, Amount, DR/CR, Hold, Reverse, Created Date, Issued By, Review Date and Time, Placement Date and Time\n`,
      { flag: 'a+' },
    );
  }

  writeToErrorFile = (outputFilePath, data, error) => {
    fs.writeFileSync(
      outputFilePath,
      `${error}, ${data['Transfer Description']}, ${data['Batch Number']}, ${data['Company Name']}, ${data['SEC Code']}, ${data['Effective Date']}, ${data['Status']}, ${data['ACHTyp']}, ${data['Recipient Name']}, ${data['Recipient Account']}, ${data['Recipient Account Type']}, ${data['Recipient ABA']}, ${data['Amount']}, ${data['DR/CR']}, ${data['Hold']}, ${data['Reverse']}, ${data['Created Date']}, ${data['Issued By']}, ${data['Review Date and Time']}, ${data['Placement Date and Time']} \n`,
      { flag: 'a+' },
    );
  }

  async parseCsv(file) {
    return new Promise((resolve, reject) => {
      const dataRows = [];
      const csvStream = fs.createReadStream(path.resolve('./Storage', file.filename));
      csv
        .parseStream(csvStream, { headers: true })
        .on('data', async (data) => {
          dataRows.push(data);
        })
        .on('error', function (e) {
          reject({ status: 'error', message: e });
        })
        .on('end', function () {
          resolve({ status: 'success', dataRows: dataRows });
          const pdfFileStream = path.resolve('./Storage', file.filename);
          fs.unlink(pdfFileStream, (err) => {
            logger.error(err);
          });
        });
    });
  }

}

export default UpdateAchRefundStatusUseCase;
