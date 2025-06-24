import logger from '@infrastructure/Logger/logger';
import * as fs from 'fs';
import moment from 'moment';
import async from 'async';
import { inject, injectable } from 'inversify';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import { InvestmentLimit } from '@domain/Core/ValueObjects/InvestmentLimit';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import { IExportUserDataUseCase } from './IExportUserDataUseCase';
import {
  IStorageService,
  IStorageServiceId,
} from '@infrastructure/Service/StorageService/IStorageService';
import path from 'path';
import {
  IExportDataRepository,
  IExportDataRepositoryId,
} from '@domain/Core/ExportData/IExportDataRepository';
import ExportData from '@domain/Core/ExportData/ExportData';
import {
  ISlackService,
  ISlackServiceId,
} from '@infrastructure/Service/Slack/ISlackService';
import config from '@infrastructure/Config';

const { slackConfig } = config;

@injectable()
class ExportUserUseCase implements IExportUserDataUseCase {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
    @inject(IStorageServiceId) private storageService: IStorageService,
    @inject(IExportDataRepositoryId) private exportDataRepository: IExportDataRepository,
    @inject(ISlackServiceId) private slackService: ISlackService,
  ) {}

  calculateInvestmentCap(
    annualIncome,
    netWorth,
    userProvidedCurrentInvestments,
    userProvidedCurrentInvestmentsDate,
  ) {
    const currentInvestments =
      userProvidedCurrentInvestments &&
      moment().diff(userProvidedCurrentInvestmentsDate, 'years', true) <= 1 // in the last 12 months
        ? userProvidedCurrentInvestments
        : 0;

    if (annualIncome <= 0 && netWorth <= 0) {
      return InvestmentLimit.DEFAULT_INVESTMENT_LIMIT;
    }

    let investmentCap = 0;
    if (
      annualIncome < InvestmentLimit.MAX_INVESTMENT ||
      netWorth < InvestmentLimit.MAX_INVESTMENT
    ) {
      investmentCap = InvestmentLimit.DEFAULT_INVESTMENT_LIMIT;
      const lesserOfTwo =
        0.05 * annualIncome > 0.05 * netWorth ? 0.05 * annualIncome : 0.05 * netWorth;

      investmentCap =
        InvestmentLimit.DEFAULT_INVESTMENT_LIMIT > lesserOfTwo
          ? InvestmentLimit.DEFAULT_INVESTMENT_LIMIT
          : lesserOfTwo > InvestmentLimit.MAX_INVESTMENT
          ? InvestmentLimit.MAX_INVESTMENT
          : lesserOfTwo;
    }

    if (
      annualIncome > InvestmentLimit.MAX_INVESTMENT &&
      netWorth > InvestmentLimit.MAX_INVESTMENT
    ) {
      investmentCap =
        0.1 * annualIncome > 0.1 * netWorth ? 0.1 * annualIncome : 0.1 * netWorth;

      investmentCap =
        investmentCap < InvestmentLimit.MAX_INVESTMENT
          ? investmentCap
          : InvestmentLimit.MAX_INVESTMENT;
    }

    investmentCap = investmentCap - currentInvestments;
    return investmentCap > 0 ? investmentCap : 0;
  }

  async execute(adminUser) {
    let requestedBy = adminUser.getName();
    const users = await this.userRepository.fetchUsersForExport();
    let documentPath = 'user-export.csv';
    fs.appendFile(
      documentPath,
      `First Name,Last Name,Email,User Signup,Detail Submitted Date,Investment Limit,Remaining Limit \n`,
      (err) => {
        if (err) throw err;
      },
    );
    async.eachSeries(
      users,
      async (user) => {
        const amount = await this.campaignFundRepository.fetchInvestorSum(
          user.investorId,
        );
        const annualIncome = user.annualIncome === null ? 0 : user.annualIncome;
        const netWorth = user.netWorth === null ? 0 : user.netWorth;
        const userProvidedCurrentInvestments =
          user.userProvidedCurrentInvestments === null
            ? 0
            : user.userProvidedCurrentInvestments;
        const investmentLimit = this.calculateInvestmentCap(
          annualIncome,
          netWorth,
          userProvidedCurrentInvestments,
          user.userProvidedCurrentInvestmentsDate,
        );
        const remainingLimit =
          amount !== null ? investmentLimit - amount : investmentLimit;
        const detailSubmittedDate =
          user.detailSubmittedDate !== null
            ? moment(user.detailSubmittedDate).format('YYYY-MM-DD HH:mm:ss')
            : 'N/A';
        const createdAt = moment(user.createdAt).format('YYYY-MM-DD HH:mm:ss');
        fs.appendFile(
          documentPath,
          `${user.firstName},${user.lastName},${user.email},${createdAt},${detailSubmittedDate},${investmentLimit},${remainingLimit} \n`,
          (err) => {
            if (err) {
              this.slackService.publishMessage({
                message: `${err}`,
                slackChannelId: slackConfig.ERROS.ID,
              });
              const pdfFileStream = path.resolve(`/honeycomb-api/${documentPath}`);
              fs.unlink(pdfFileStream, (err) => {
                logger.error(err);
              });
            }
          },
        );
      },
      async () => {
        const fileName = `userExport-${Date.now()}-${Math.round(
          Math.random() * 1e9,
        )}${path.extname(documentPath)}`;
        const filepath = `uploads/dataExport/${fileName}`;
        const pdfFileStream = path.resolve(`/honeycomb-api/${documentPath}`);
        await this.storageService.uploadPdfFile(pdfFileStream, filepath);
        const documentType = 'User Export';
        const exportData = ExportData.createFromDetail(
          documentType,
          fileName,
          filepath,
          'text/csv',
          'csv',
          requestedBy,
        );
        await this.exportDataRepository.add(exportData);
        fs.unlink(pdfFileStream, (err) => {
          logger.error(err);
        });
      },
    );

    return;
  }
}

export default ExportUserUseCase;
