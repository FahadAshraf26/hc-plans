import { injectable, inject } from 'inversify';
import logger from '@infrastructure/Logger/logger';
import * as fs from 'fs';
import async from 'async';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
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
import ExportEducationalDataDTO from './ExportEducationalDataDTO';
import moment from 'moment';

const { slackConfig } = config;

@injectable()
class ExportEducationalDataUsecase {
  constructor(
    @inject(IStorageServiceId) private storageService: IStorageService,
    @inject(IExportDataRepositoryId) private exportDataRepository: IExportDataRepository,
    @inject(ISlackServiceId) private slackService: ISlackService,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
  ) {}

  async execute(exportEducationalDataDTO: ExportEducationalDataDTO) {
    const userData = await this.userRepository.exportEducationalData(
      exportEducationalDataDTO.getStartDate(),
      exportEducationalDataDTO.getEndDate(),
    );
    let documentPath = 'user-educational-email-campaign.csv';
    fs.appendFile(
      documentPath,
      `First Name,Last Name,Email Address,Registration Type,Date User Account Created,Email Verified,Last investment date \n`,
      (err) => {
        if (err) throw err;
      },
    );
    async.eachSeries(
      userData,
      async (user) => {
        const lastInvestmentDate = user['Last investment date'] !== null || user['Last investment date'] === "" ? moment(user['Last investment date']).format('YYYY-MM-DD') : "Null"
        fs.appendFile(
          documentPath,
          `${user['First Name']},${user['Last Name']},${user['Email Address']},${user['Registration Type']},${moment(user['Date User Account Created']).format('YYYY-MM-DD HH:mm:ss')},${user['Email Verified']},${lastInvestmentDate} \n`,
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
        const fileName = `educational-email-campaign-${Date.now()}=${Math.round(
          Math.random() * 1e9,
        )}${path.extname(documentPath)}`;
        const filePath = `uploads/dataExport/${fileName}`;
        const pdfFileStream = path.resolve(`/honeycomb-api/${documentPath}`);
        await this.storageService.uploadPdfFile(pdfFileStream, filePath);
        const documentType = 'Educational-Email-Campaign';
        const exportData = ExportData.createFromDetail(
          documentType,
          fileName,
          filePath,
          'text/csv',
          'csv',
          '',
        );
        await this.exportDataRepository.add(exportData);
        fs.unlink(pdfFileStream, (err) => {
          logger.error(err);
        });
      },
    );
  }
}

export default ExportEducationalDataUsecase;
