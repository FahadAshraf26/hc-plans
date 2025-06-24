import {
  IExportDataRepository,
  IExportDataRepositoryId,
} from '@domain/Core/ExportData/IExportDataRepository';
import { inject, injectable } from 'inversify';
import { IExportDataService } from './IExportDataService';
import GetAllExportDataDTO from './GetAllExportDataDTO';
import {
  IStorageService,
  IStorageServiceId,
} from '@infrastructure/Service/StorageService/IStorageService';
import {
  ICampaignRepository,
  ICampaignRepositoryId,
} from '@domain/Core/Campaign/ICampaignRepository';
import * as fs from 'fs';
import async from 'async';
import {
  ISlackService,
  ISlackServiceId,
} from '@infrastructure/Service/Slack/ISlackService';
import config from '@infrastructure/Config';
import path from 'path';
import logger from '@infrastructure/Logger/logger';
import ExportData from '@domain/Core/ExportData/ExportData';
import { IUserService, IUserServiceId } from '@application/User/IUserService';

const { slackConfig, server } = config;

@injectable()
class ExportDataService implements IExportDataService {
  constructor(
    @inject(IExportDataRepositoryId) private exportDataRepository: IExportDataRepository,
    @inject(IStorageServiceId) private storageService: IStorageService,
    @inject(ICampaignRepositoryId) private campaignRepository: ICampaignRepository,
    @inject(IUserServiceId) private userService: IUserService,
    @inject(ISlackServiceId) private slackService: ISlackService,
  ) { }

  async getAllExportedData(getAllExportDataDTO: GetAllExportDataDTO) {
    const paginationOptions = getAllExportDataDTO.getPaginationOptions();
    const response = await this.exportDataRepository.fetchAllExports(paginationOptions);
    return response.getPaginatedData();
  }

  async getSignedUrl(documentPath) {
    return this.storageService.generateV4ReadSignedUrl(documentPath);
  }


  async exportAllUsersInvestments(adminUser: any): Promise<any> {
    let requestedBy = adminUser.getName();
    const investmentData = await this.userService.getAllUsersInvestments();
    let documentPath = 'users-investments-export.csv';
    fs.appendFile(documentPath, `Email, First Name, Last Name, Number of Investments, First Investment Date, Last Investment Date \n`, (err) => {
      if (err) throw err;
    });

    async.eachSeries(
      investmentData,
      async (investment) => {
        const { email, firstName, lastName, campaignFundCount, firstCampaignFund, lastCampaignFund } = investment.dataValues;
        await this.appendFile(documentPath, email, firstName, lastName, campaignFundCount, firstCampaignFund, lastCampaignFund);
      },
      async () => {
        const fileName = `usersInvestments-${Date.now()}-${Math.round(
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
        await this.slackService.publishMessage({
          message: `Users investments request by ${requestedBy} is available on admin panel`,
          slackChannelId: slackConfig.EMPLOYEE_ACTIVITY.ID,
          url: `${server.ADMIN_PANEL_LINK}/visualizations/export-requests`,
          btnText: 'View File',
        });
        fs.unlink(pdfFileStream, (err) => {
          logger.error(err);
        });
      },
    );
  }

  async exportCampaignTagData(adminUser) {
    let requestedBy = adminUser.getName();
    const campaignTagsData = await this.campaignRepository.fetchAllCampaignTags();
    let documentPath = 'campaign-tags-export.csv';
    fs.appendFile(documentPath, `Campaign ID,Campaign Data, Tags \n`, (err) => {
      if (err) throw err;
    });
    async.eachSeries(
      campaignTagsData,
      async (campaignTag) => {
        let tagArray = [];
        const tags = JSON.parse(campaignTag.campaignTags);
        tags.forEach((item) => {
          tagArray.push(item.tag);
        });
        fs.appendFile(
          documentPath,
          `${campaignTag.campaignId},${campaignTag.campaignName},${JSON.stringify(
            tagArray,
          )} \n`,
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
        const fileName = `campaignTagsExport-${Date.now()}-${Math.round(
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
        await this.slackService.publishMessage({
          message: `CampaignTags request by ${requestedBy} is available on admin panel`,
          slackChannelId: slackConfig.EMPLOYEE_ACTIVITY.ID,
          url: `${server.ADMIN_PANEL_LINK}/visualizations/export-requests`,
          btnText: 'View File',
        });
        fs.unlink(pdfFileStream, (err) => {
          logger.error(err);
        });
      },
    );
  };

  private async appendFile(documentPath: string, email: string, firstName: string, lastName: string, campaignFundCount: number, firstCampaignFund: Date, lastCampaignFund: Date): Promise<void> {
    fs.appendFile(
      documentPath,
      `${email},${firstName},${lastName}, ${campaignFundCount}, ${new Date(firstCampaignFund).toLocaleDateString()}, ${new Date(lastCampaignFund).toLocaleDateString()} \n`,
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
  }
}

export default ExportDataService;
