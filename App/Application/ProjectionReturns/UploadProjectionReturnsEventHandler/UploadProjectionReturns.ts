import async from 'async';
import fs from 'fs';
import path from 'path';
import {
  ISlackService,
  ISlackServiceId,
} from '@infrastructure/Service/Slack/ISlackService';
import { inject, injectable } from 'inversify';
import { IUploadProjectionReturns } from './IUploadProjectionReturns';
import { IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import { IUserRepository } from '@domain/Core/User/IUserRepository';
import config from '@infrastructure/Config';
import logger from '@infrastructure/Logger/logger';
import moment from 'moment';
import InvestorPayment from '@domain/Core/InvestorPayment/InvestorPayment';
import { IIssuerRepository, IIssuerRepositoryId } from '@domain/Core/Issuer/IIssuerRepository';
import { ProjectionReturns } from '@domain/Core/ProjectionReturns/ProjectionReturns';
import { IProjectionReturnsRepositoryId } from '@domain/Core/ProjectionReturns/IProjectionReturnsRepository';
import { IProjectionReturnsRepository } from '@domain/Core/ProjectionReturns/IProjectionReturnsRepository';
import { IInvestorPaymentsRepositoryId } from '@domain/Core/InvestorPayments/IInvestorPaymentsRepository';
import { IInvestorPaymentsRepository } from '@domain/Core/InvestorPayments/IInvestorPaymentsRepository';
import mailService from '@infrastructure/Service/MailService';
import emailTemplates from '@domain/Utils/EmailTemplates';

const { slackConfig } = config;
const { SendHtmlEmail } = mailService;
const { uploadRepaymentErrorFileTemplate } = emailTemplates;

@injectable()
class UploadProjectionReturns implements IUploadProjectionReturns {
  constructor(
    @inject(ISlackServiceId) private slackService: ISlackService,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IIssuerRepositoryId) private issuerRepository: IIssuerRepository,
    @inject(IProjectionReturnsRepositoryId)
    private projectionRetursRepository: IProjectionReturnsRepository,
    @inject(IInvestorPaymentsRepositoryId)
    private investorPaymentsRepository: IInvestorPaymentsRepository,
  ) { }
  async importProjectionReturns(investorRepaymentObjects: any, userEmail: string) {
    return new Promise((resolve, reject) => {
      let errors: string[] = [];
      const outputFilePath = path.resolve('Storage/UploadFutureRepaymentsErrorsFile.csv');
      this.createHeaderForErrorFile(outputFilePath);

      async.eachSeries(
        investorRepaymentObjects,
        async (investorPaymentObject: any) => {
          if (!investorPaymentObject) {
            logger.error('Investor repayment file is empty.');
            errors.push('Investor repayment files is empty.');
            return;
          }

          let { Email: email } = investorPaymentObject;

          if (email) {
            try {
              const user = await this.userRepository.fetchByEmail(email, false);
              if (user) {
                if (moment(investorPaymentObject['Q1 Payment Date'], ["MM/DD/YYYY", "MM/D/YYYY", "M/DD/YYYY", "M/D/YYYY", "MM/DD/YY", "MM/D/YY", "M/DD/YY", "M/D/YY"], true).isValid()) {
                  const campaignId = investorPaymentObject['Campaign ID'];
                  const createdAt = moment(investorPaymentObject['Q1 Payment Date'], 'MM/DD/YYYY').add(1, 'seconds').format("YYYY-MM-DD HH:mm:ss");
                  const prorate = investorPaymentObject.prorate.replace('%', '');
                  const investorPayments = await this.investorPaymentsRepository.getInvestorPaymentsWithProrate(
                    user.investor.investorId,
                    campaignId,
                    prorate,
                    createdAt,
                  );

                  if (investorPayments.length === 0) {
                    let entityId = null;
                    if (
                      investorPaymentObject['Investor Type'] &&
                      investorPaymentObject['Investor Type'] !== '' &&
                      investorPaymentObject['Investor Type'] !== 'Individual'
                    ) {
                      const issuer = await this.issuerRepository.fetchByName(
                        investorPaymentObject['Entity Name'],
                      );
                      if (!issuer) {
                        errors.push(`\nError Issuer not found - ${investorPaymentObject.Email} - ${investorPaymentObject['Issuer Name']}`);
                        this.writeToErrorFile(outputFilePath, investorPaymentObject, "Issuer Not Found");
                      } else {
                        entityId = issuer.issuerId;
                      }
                    }

                    const investorPayment = InvestorPayment.createFromDetail({
                      prorate: prorate,
                      campaignId,
                      investorId: user.investor.investorId,
                      entityId,
                      createdAt,
                    });
                    await this.investorPaymentsRepository.add(investorPayment);
                    await this.createProjectionReturns(
                      investorPaymentObject,
                      investorPayment.getInvestorPaymentsId(),
                    );
                  }
                } else {
                  logger.error(`Date in wrong format, expected format: "MM/DD/YYYY" - ${investorPaymentObject.Email}\n`)
                  errors.push(`\nError date in wrong format, expected format: "MM/DD/YYYY" - ${investorPaymentObject.Email} - ${investorPaymentObject['Issuer Name']}`);
                  this.writeToErrorFile(outputFilePath, investorPaymentObject, 'Date not in "MM/DD/YYYY" format');
                }
              } else {
                logger.error(`Error User Not Found - ${investorPaymentObject.Email}\n`)
                errors.push(`\nError User not found- ${investorPaymentObject.Email} - ${investorPaymentObject['Issuer Name']}`);
                this.writeToErrorFile(outputFilePath, investorPaymentObject, "Issuer Not Found");
              }
            } catch (error) {
              logger.error(error, investorPaymentObject.Email);
              errors.push(`\nError ${error.message}- ${investorPaymentObject.Email} - ${investorPaymentObject['Issuer Name']}`);
              this.writeToErrorFile(outputFilePath, investorPaymentObject, error.message);
            }
          }
        },
        (err) => {
          if (err) {
            logger.error('Error processing repayments: ', err);
            reject(err);
            return;
          }
          this.slackNotification(errors);
          this.sendErrorFileEmail(outputFilePath, userEmail);
          resolve(true);
        },
      );
    });
  }

  createProjectionReturns = async (investorPaymentObject, investorPaymentsId) => {
    const queryData = [];
    for (let i = 1; i <= 20;) {
      //These keys are for quarterly payments
      let dateKey = `Q${i} Payment Date`;
      let interestKey = `Q${i} Interest`;
      let principalKey = `Q${i} Principal`;

      if (investorPaymentObject[dateKey] && investorPaymentObject[dateKey] !== '') {
        i += 1;
        const paymentDate = investorPaymentObject[dateKey];
        const interest =
          investorPaymentObject[interestKey] == 0.0 ||
            investorPaymentObject[interestKey] == '-'
            ? 0
            : investorPaymentObject[interestKey].replace(',', '');
        const principle =
          investorPaymentObject[principalKey] == 0.0
            ? 0
            : investorPaymentObject[principalKey].replace(',', '');

        const createdAt = moment(investorPaymentObject[dateKey], ["MM/DD/YYYY", "MM/D/YYYY", "M/DD/YYYY", "M/D/YYYY", "MM/DD/YY", "MM/D/YY", "M/DD/YY", "M/D/YY"], true).isValid()
          ? moment(investorPaymentObject[dateKey], 'MM/DD/YYYY').add(1, 'seconds').format("YYYY-MM-DD HH:mm:ss")
          : moment(investorPaymentObject[dateKey], 'DD/MM/YYYY').add(1, 'seconds').format("YYYY-MM-DD HH:mm:ss");

        const projectionReturn = ProjectionReturns.createFromCsvInput({
          interest,
          principle,
          investorPaymentsId,
          createdAt,
        });
        await this.projectionRetursRepository.add(projectionReturn);
        logger.info(`Future Repayment uploaded successfully ~~~ ${investorPaymentObject.Email}`);
      } else {
        i += 1;
      }
    }

    return queryData.join(', ');
  };

  slackNotification = (errors) => {
    if (errors.length > 0) {
      logger.error('Records having errors', errors);
      this.slackService.publishMessage({
        message: `Found errors while importing future repayments: \n${errors}`,
        slackChannelId: slackConfig.EMPLOYEE_ACTIVITY.ID,
      });
    } else {
      logger.info(`Future Repayments Imported Successfully`);
      this.slackService.publishMessage({
        message: "Future Repayments Imported Successfully",
        slackChannelId: slackConfig.EMPLOYEE_ACTIVITY.ID,
      })
    }
  };

  sendErrorFileEmail = async (outputFilePath: string, email: string) => {
    await SendHtmlEmail(
      email,
      "Future Repayments Upload Error Notifications",
      uploadRepaymentErrorFileTemplate,
      [
        { filename: "outputErrorFilePath.csv", content: fs.createReadStream(outputFilePath) }
      ],
    )
    this.deleteErrorFile(outputFilePath);
  }

  createHeaderForErrorFile = (outputFilePath) => {
    fs.writeFileSync(
      outputFilePath,
      `Error, Email, Issuer Name, Campaign ID, Investor Name, Investor Type, Entity Name, prorate\n`,
      { flag: 'a+' },
    );
  }

  writeToErrorFile = (outputFilePath, data, error) => {
    fs.writeFileSync(
      outputFilePath,
      `${error}, ${data['Email']}, ${data['Issuer Name']}, ${data['Campaign ID']}, ${data['Investor Name']}, ${data['Investor Type']}, ${data['Entity Name']}, ${data['prorate']}\n`,
      { flag: 'a+' },
    );
  }

  deleteErrorFile = (outputFilePath) => {
    fs.unlinkSync(outputFilePath);
  }
}

export default UploadProjectionReturns;
