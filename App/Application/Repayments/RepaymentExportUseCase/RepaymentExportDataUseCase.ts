import { IRepaymentExportDataUseCase } from './IRepaymentExportDataUseCase';
import { injectable, inject } from 'inversify';
import {
  IRepaymentsRepositoryId,
  IRepaymentsRepository,
} from '@domain/Core/Repayments/IRepaymentsRepository';
import logger from '@infrastructure/Logger/logger';
import * as fs from 'fs';
import async from 'async';
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
class RepaymentExportDataUseCase implements IRepaymentExportDataUseCase {
  constructor(
    @inject(IRepaymentsRepositoryId) private repaymentsRepository: IRepaymentsRepository,
    @inject(IStorageServiceId) private storageService: IStorageService,
    @inject(IExportDataRepositoryId) private exportDataRepository: IExportDataRepository,
    @inject(ISlackServiceId) private slackService: ISlackService,
  ) { }
  
  async execute(adminUser) {
    let requestedBy = adminUser.getName();
    const repayments = await this.repaymentsRepository.fetchInvestorsRepayments();
    let documentPath = 'repayments.csv';
    fs.appendFile(
      documentPath,
      `Investor Name,Investor Email,Campaign ID,Campaign Name,Interest Paid,Principal Paid,Payment Date \n`,
      (err) => {
        if (err) throw err;
      },
    );

    async.eachSeries(repayments, async (repayment) => {
      fs.appendFile(
        documentPath,
        `${repayment['Investor Name']},${repayment['Investor Email']},${repayment['Campaign Id']},${repayment['Campaign Name']},${repayment['Interest Paid']},${repayment['Principal Paid']},${repayment['Payment Date']} \n`,
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
    }, async () => {
      const fileName = `repayments-${Date.now()}-${Math.round(
        Math.random() * 1e9,
      )}${path.extname(documentPath)}`;
      const filepath = `uploads/dataExport/${fileName}`;
      const pdfFileStream = path.resolve(`/honeycomb-api/${documentPath}`);
      await this.storageService.uploadPdfFile(pdfFileStream, filepath);
      const documentType = 'Repayments';
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
    })
  }
}

export default RepaymentExportDataUseCase;
