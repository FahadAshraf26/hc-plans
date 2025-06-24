import { inject, injectable } from 'inversify';
import { IExportInvestorProjectionReturnsUseCase } from './IExportInvestorProjectionReturnsUseCase';
import logger from '@infrastructure/Logger/logger';
import * as fs from 'fs';
import async from 'async';
import {
  IProjectionReturnsRepository,
  IProjectionReturnsRepositoryId,
} from '@domain/Core/ProjectionReturns/IProjectionReturnsRepository';
import {
  IStorageService,
  IStorageServiceId,
} from '@infrastructure/Service/StorageService/IStorageService';
import config from '@infrastructure/Config';
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

const { slackConfig } = config;

@injectable()
class ExportInvestorProjectionReturnsUseCase
  implements IExportInvestorProjectionReturnsUseCase {
  constructor(
    @inject(IProjectionReturnsRepositoryId)
    private projectionReturnRepository: IProjectionReturnsRepository,
    @inject(IStorageServiceId) private storageService: IStorageService,
    @inject(IExportDataRepositoryId) private exportDataRepository: IExportDataRepository,
    @inject(ISlackServiceId) private slackService: ISlackService,
  ) {}
  async execute(adminUser) {
    let requestedBy = adminUser.getName();
    const projectionReturns = await this.projectionReturnRepository.fetchAllInvestorsProjections();
    let documentPath = 'investor-projection-returns.csv';
    fs.appendFile(
      documentPath,
      `First Name,Last Name,Email,Campaign ID,Campaign Name,Principal,Interest,Payment Date,Updated At,Deleted At \n`,
      (err) => {
        if (err) throw err;
      },
    );

    async.eachSeries(
      projectionReturns,
      async (projectionReturn) => {
        fs.appendFile(
          documentPath,
          `${projectionReturn['First Name']},${projectionReturn['Last Name']},${projectionReturn.Email},${projectionReturn['Campaign Id']},${projectionReturn['Campaign Name']},${projectionReturn.Principal},${projectionReturn.Interest},${projectionReturn['Payment Date']},${projectionReturn['Updated At']},${projectionReturn['Deleted At']} \n`,
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
        const fileName = `projectionReturns-${Date.now()}-${Math.round(
          Math.random() * 1e9,
        )}${path.extname(documentPath)}`;
        const filepath = `uploads/dataExport/${fileName}`;
        const pdfFileStream = path.resolve(`/honeycomb-api/${documentPath}`);
        await this.storageService.uploadPdfFile(pdfFileStream, filepath);
        const documentType = 'Investor Projection Returns';
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
  }
}

export default ExportInvestorProjectionReturnsUseCase;
