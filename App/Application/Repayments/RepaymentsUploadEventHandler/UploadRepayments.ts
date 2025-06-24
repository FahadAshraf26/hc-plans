import async from 'async';
import path from 'path';
import fs from 'fs';
import {
  ISlackService,
  ISlackServiceId,
} from '@infrastructure/Service/Slack/ISlackService';
import Repayments from '@domain/Core/Repayments/Repayments';
import { inject, injectable } from 'inversify';
import { IUploadRepayments } from './IUploadRepayments';
import { IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import { IUserRepository } from '@domain/Core/User/IUserRepository';
import { ICampaignRepository, ICampaignRepositoryId } from '@domain/Core/Campaign/ICampaignRepository';
import config from '@infrastructure/Config';
import logger from '@infrastructure/Logger/logger';
import { dollarToNumber } from '@infrastructure/Utils/dollarFormatToNumber';
import { IRepaymentsRepository, IRepaymentsRepositoryId } from '@domain/Core/Repayments/IRepaymentsRepository';
import mailService from '@infrastructure/Service/MailService';
import emailTemplates from '@domain/Utils/EmailTemplates';
import moment from 'moment';

const { slackConfig } = config;
const { SendHtmlEmail } = mailService;
const { uploadRepaymentErrorFileTemplate } = emailTemplates;

@injectable()
class UploadRepayments implements IUploadRepayments {
  constructor(
    @inject(ISlackServiceId) private slackService: ISlackService,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(ICampaignRepositoryId) private campaignRepository: ICampaignRepository,
    @inject(IRepaymentsRepositoryId) private repaymentsRepository: IRepaymentsRepository,
  ) { }
  async importRepayments(investorRepaymentObjects: any, userEmail: string) {
    return new Promise((resolve, reject) => {
      let errors: string[] = [];
      const outputFilePath = path.resolve('Storage/UploadRepaymentErrorsFile.csv');
      this.createHeaderForErrorFile(outputFilePath);

      async.eachSeries(
        investorRepaymentObjects,
        async (investorRepaymentObject: any) => {
          if (!investorRepaymentObject) {
            logger.error('Investor repayment file is empty.');
            errors.push('Investor repayment files is empty.');
            return;
          }

          let { Email: email } = investorRepaymentObject;
          let { company: campaignName } = investorRepaymentObject;

          if (email) {
            try {
              const user = await this.userRepository.fetchByEmail(email, false);
              if (user) {
                const campaign = await this.campaignRepository.checkNameAvailbility(campaignName);

                const repaymentObject = Repayments.createFromDetail(
                  dollarToNumber(investorRepaymentObject["interest paid"]),
                  dollarToNumber(investorRepaymentObject["principal paid"]),
                  (investorRepaymentObject["status"]),
                  investorRepaymentObject["payment method"],
                  dollarToNumber(investorRepaymentObject["Total"]),
                  investorRepaymentObject["account name"],
                )
                if(moment(investorRepaymentObject['date'], ["MM/DD/YYYY", "MM/D/YYYY", "M/DD/YYYY", "M/D/YYYY", "MM/DD/YY", "MM/D/YY", "M/DD/YY", "M/D/YY"], true).isValid()){
                  repaymentObject.setCreatedAt(moment(investorRepaymentObject['date'], "MM/DD/YYYY").add(1, 'seconds').format("YYYY-MM-DD HH:mm:ss"));   
                  if (campaign) {
                    repaymentObject.setCampaignId(campaign.campaignId);
                  }
                  repaymentObject.setInvestorId(user.investor.investorId);
  
                  await this.repaymentsRepository.add(repaymentObject);
                  logger.info('user repayments uploaded successfully ~~~ ', email);
                } else{
                  logger.error('Date in wrong format, expected format: "MM/DD/YYYY"', email)
                  errors.push(`\nError date in wrong format, expected format: "MM/DD/YYYY" - ${email} - ${investorRepaymentObject['company']} - ${investorRepaymentObject['Total']}`)
                  this.writeToErrorFile(outputFilePath, investorRepaymentObject, 'Date not in "MM/DD/YYYY" format');
                }
              } else {
                logger.error('user does not exists', investorRepaymentObject.Email);
                errors.push(`\nError User Not Found - ${email} - ${investorRepaymentObject['company']} - ${investorRepaymentObject['Total']}`);
                this.writeToErrorFile(outputFilePath, investorRepaymentObject, "User Not Found");
              }
            } catch (error) {
              logger.error(error, investorRepaymentObject.Email);
              errors.push(`\nError ${error.message} - ${investorRepaymentObject.Email} - ${investorRepaymentObject['company']} - ${investorRepaymentObject['Total']}`);
              this.writeToErrorFile(outputFilePath, investorRepaymentObject, error.message);
            }
          }
        },
        (err) => {
          if (err) {
            logger.error('Error processing repayments: ', err);
            reject(err);
            return;
          }
          this.slackNotification(errors)
          this.sendErrorFileEmail(outputFilePath, userEmail);
          resolve(true);
        },
      );
    });
  }

  slackNotification = (errors) => {
    if (errors.length>0) {
      logger.error('Records having errors', errors);
      this.slackService.publishMessage({
        message: `Found errors while importing repayments: \n${errors}`,
        slackChannelId: slackConfig.EMPLOYEE_ACTIVITY.ID,
      });
    } else {
      logger.info(`Repayments Imported Successfully`);
      this.slackService.publishMessage({
        message: "Repayments Imported Successfully",
        slackChannelId: slackConfig.EMPLOYEE_ACTIVITY.ID,
      })
    }
  };

  sendErrorFileEmail = async (outputFilePath: string, email: string) => {
    await SendHtmlEmail(
      email,
      "Repayments Upload Error Notifications",
      uploadRepaymentErrorFileTemplate,
      [
        { filename: "outputErrorFilePath.csv", content: fs.createReadStream(outputFilePath) }
      ],
    )
    this.deleteErrorFile(outputFilePath);
  }

  createHeaderForErrorFile = (outputFilePath: string) => {
    fs.writeFileSync(
      outputFilePath,
      `Error, Email, date, company, investor name, account name, payment method, interest paid, principal paid, status, Total\n`,
      { flag: 'a+' },
    );
  }

  writeToErrorFile = (outputFilePath, data, error) => {
    fs.writeFileSync(
      outputFilePath,
      `${error}, ${data['Email']}, ${data['date']}, ${data['company']}, ${data['investor name']}, ${data['account name']}, ${data['payment method']}, ${data['interest paid']}, ${data['principal paid']}, ${data['status']}, ${data['Total']} \n`,
      { flag: 'a+' },
    );
  }

  deleteErrorFile = (outputFilePath) => {
    fs.unlinkSync(outputFilePath);
  }
}

export default UploadRepayments;
