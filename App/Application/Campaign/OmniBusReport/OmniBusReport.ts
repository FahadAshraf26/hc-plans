import { inject, injectable } from 'inversify';
import { IOmniBusReport } from './IOmniBusReport';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import dollarFormatter from '@infrastructure/Utils/dollarFormatter';
import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import * as fs from 'fs';
import path from 'path';
import logger from '@infrastructure/Logger/logger';
import mailService from '@infrastructure/Service/MailService';
import config from '@infrastructure/Config';

const { emailConfig } = config;
const { SendHtmlEmail } = mailService;

@injectable()
class OmniBusReport implements IOmniBusReport {
  constructor(
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
  ) {}

  async execute(campaign: any): Promise<boolean> {
    const result = await this.campaignFundRepository.fetchMultipleCampaignsReport(
      campaign.campaignStartDate,
      campaign.campaignEndDate,
      [campaign.campaignName],
      [campaign.campaignStage],
    );
    let balanceReportPath = `${campaign.campaignName}-offering-balance-report.csv`;
    let investmentReportPAth = `${campaign.campaignName}-offering-Investment-Detail-Report.csv`;
    fs.writeFileSync(
      balanceReportPath,
      `Campaign ID,Escrow Bank, Investment Date, Investor Name, Investor Email, Investment Amount, Fee, Account Type, Investment Status, Entity Name, Net Amount \n`,
      { flag: 'a+' },
    );
    await result.forEach(async (item) => {
      const transactionTypeLower = item.campaignHybridTransactions.transactionType.toLowerCase();
      const { applicationFee, amount } = item.campaignHybridTransactions;

      let accountType;
      if (
        transactionTypeLower === 'creditcard' ||
        transactionTypeLower === 'googlepay' ||
        transactionTypeLower === 'applepay'
      ) {
        accountType =
          transactionTypeLower === 'creditcard'
            ? 'Credit Card'
            : transactionTypeLower === 'googlepay'
            ? 'Google Pay'
            : 'Apple Pay';
      } else {
        accountType = transactionTypeLower === 'hybrid' ? 'Hybrid' : 'ACH';
      }

      fs.writeFileSync(
        balanceReportPath,
        `${item.campaign.campaignId},${item.campaign.escrowType},${item.createdAt}, '${
          item.campaignInvestor.user.firstName
        } ${item.campaignInvestor.user.lastName}', ${
          item.campaignInvestor.user.email
        },${dollarFormatter.format(amount)}, ${dollarFormatter.format(
          applicationFee,
        )}, ${accountType}, ${item.campaignHybridTransactions.status}, ${
          item.entity
        }, ${dollarFormatter.format(item.netAmount)} \n`,
        { flag: 'a+' },
      );
    });

    const [campaignDetailInvestment] = await Promise.all([
      await this.campaignFundRepository.fetchSumInvestmentByCampaignsReport(
        [campaign.campaignName],
        true,
        [campaign.CampaignStage],
        campaign.campaignStartDate,
        campaign.campaignEndDate,
      ),
    ]);
    if (campaignDetailInvestment.length === 0) {
      0;
    }
    const newCampaignDetailInvestment = [];
    for (const i of campaignDetailInvestment) {
      const test = newCampaignDetailInvestment.findIndex((v) => {
        return v['Campaign ID'] === i['Campaign ID'];
      });
      if (test != -1) {
        if (newCampaignDetailInvestment[test]['status'] === ChargeStatus.SUCCESS) {
          newCampaignDetailInvestment[test]['Non-cleared Amount'] =
            i['Non-cleared Amount'];
        } else {
          newCampaignDetailInvestment[test]['Cleared Amount'] = i['Cleared Amount'];
        }
      } else {
        newCampaignDetailInvestment.push(i);
      }
    }
    fs.writeFileSync(
      investmentReportPAth,
      `Campaign ID,Campaign Name, Campaign Stage, Escrow Bank, Cleared Amount, Cleared Amount (%), Non-Cleared Amount, Non-Cleared Amount (%) \n`,
      { flag: 'a+' },
    );
    newCampaignDetailInvestment.forEach((item) => {
      fs.writeFileSync(
        investmentReportPAth,
        `${item['Campaign ID']}, ${item['Campaign Name']}, ${item['Campaign Stage']}, ${
          item['Escrow Bank']
        }, ${item['Cleared Amount']}, ${
          item['Cleared Amount'] /
          (Number(item['Cleared Amount']) + Number(item['Non-cleared Amount']))
        }, ${item['Non-cleared Amount']}, ${
          item['Non-cleared Amount'] /
          (Number(item['Cleared Amount']) + Number(item['Non-cleared Amount']))
        } \n`,
        { flag: 'a+' },
      );
    });

    const pdfFileStream = path.resolve(`/honeycomb-api/${balanceReportPath}`);
    const pdfFileStreamReport = path.resolve(`/honeycomb-api/${investmentReportPAth}`);
    await SendHtmlEmail(
      emailConfig.MAIL_FROM,
      `${campaign.campaignName} Omnibus Reports`,
      `${campaign.campaignName}-offering-balance-report.csv and ${campaign.campaignName}-offering-Investment-Detail-Report.csv`,
      [
        { balanceReportPath, content: fs.createReadStream(pdfFileStream) },
        { investmentReportPAth, content: fs.createReadStream(pdfFileStreamReport) },
      ],
    );
    fs.unlink(pdfFileStream, (err) => {
      logger.error(err);
    });
    fs.unlink(pdfFileStreamReport, (err) => {
      logger.error(err);
    });

    return true;
  }
}

export default OmniBusReport;
