import { inject, injectable } from 'inversify';
import { IExportInvestorRateOfReturnUseCase } from './IExportInvestorRateOfReturnUseCase';
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
class ExportInvestorRateOfReturnUseCase implements IExportInvestorRateOfReturnUseCase {
  constructor(
    @inject(IProjectionReturnsRepositoryId)
    private projectionReturnRepository: IProjectionReturnsRepository,
    @inject(IStorageServiceId) private storageService: IStorageService,
    @inject(IExportDataRepositoryId) private exportDataRepository: IExportDataRepository,
    @inject(ISlackServiceId) private slackService: ISlackService,
  ) {}
  async execute(adminUser) {
    let requestedBy = adminUser.getName();
    const projectionReturns = await this.projectionReturnRepository.fetchInvestorsProjections();
    let documentPath = 'investor-rate-of-returns.csv';
    fs.appendFile(
      documentPath,
      `First Name,Last Name,Email,Total Invested,Campaign ID,Campaign Name,Total Projections,Investor Rate of Return,Principal Paid,Interest Paid \n`,
      (err) => {
        if (err) throw err;
      },
    );

    async.eachSeries(
      projectionReturns,
      async (projectionReturn) => {
        fs.appendFile(
          documentPath,
          `${projectionReturn.firstName},${projectionReturn.lastName},${projectionReturn.email},${projectionReturn.totalInvested},${projectionReturn.campaignId},${projectionReturn.campaignName},${projectionReturn.totalProjections},${projectionReturn.investorRateOfReturn},${projectionReturn.principalPaid},${projectionReturn.interestPaid} \n`,
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
        const fileName = `investorRateOfReturn-${Date.now()}-${Math.round(
          Math.random() * 1e9,
        )}${path.extname(documentPath)}`;
        const filepath = `uploads/dataExport/${fileName}`;
        const pdfFileStream = path.resolve(`/honeycomb-api/${documentPath}`);
        await this.storageService.uploadPdfFile(pdfFileStream, filepath);
        const documentType = 'Investor Rate of Return';
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

export default ExportInvestorRateOfReturnUseCase;
