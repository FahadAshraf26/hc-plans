import { FetchInvestorCampaignProjectionsDTO } from './FetchInvestorCampaignProjectionsDTO';
import { FetchInvestorProjectionsDTOWithPagination } from './FetchInvestorProjectionsDTOWithPagination';
import { FetchInvestorProjectionsDTOWithoutPagination } from './FetchInvestorProjectionsDTOWithoutPagination';
import {
  IProjectionReturnsRepositoryId,
  IProjectionReturnsRepository,
} from '@domain/Core/ProjectionReturns/IProjectionReturnsRepository';
import { inject, injectable } from 'inversify';
import { IProjectionReturnsService } from './IProjectionReturnsServcie';
import { IUploadProjectionReturns } from '@application/ProjectionReturns/UploadProjectionReturnsEventHandler/IUploadProjectionReturns';
import { ISlackService } from '@infrastructure/Service/Slack/ISlackService';
import { IUploadProjectionReturnsId } from '@application/ProjectionReturns/UploadProjectionReturnsEventHandler/IUploadProjectionReturns';
import { ISlackServiceId } from '@infrastructure/Service/Slack/ISlackService';
import { IInvestorPaymentsRepositoryId } from '@domain/Core/InvestorPayments/IInvestorPaymentsRepository';
import { IInvestorPaymentsRepository } from '@domain/Core/InvestorPayments/IInvestorPaymentsRepository';
import fs from 'fs';
import path from 'path';
import config from '@infrastructure/Config';
import UploadProjectionReturnsDTO from '@application/ProjectionReturns/UploadProjectionReturnsDTO';
import DeleteProjectionReturnsDTO from '@application/ProjectionReturns/DeleteProjectionReturnsDTO';
import logger from '@infrastructure/Logger/logger';
import * as csv from 'fast-csv';
import async from 'async';
import { UploadProjectionReturnsEventHandler } from '@application/ProjectionReturns/UploadProjectionReturnsEventHandler';
import { validateFileHeaders } from '@infrastructure/Utils/validateFileHeaders';
import { uploadProjectionReturnsFileHeaders } from '@infrastructure/Utils/uplaodProjectionReturnsFileHeaders';
import { IStorageService, IStorageServiceId } from '@infrastructure/Service/StorageService/IStorageService';

const { slackConfig } = config;


@injectable()
class ProjectionReturnsService implements IProjectionReturnsService {
  constructor(
    @inject(IProjectionReturnsRepositoryId)
    private projectionReturnsRepository: IProjectionReturnsRepository,
    @inject(IInvestorPaymentsRepositoryId)
    private investorPaymentsRepository: IInvestorPaymentsRepository,
    @inject(ISlackServiceId) private slackService: ISlackService,
    @inject(IUploadProjectionReturnsId) private uploadProjectionReturnsUseCase: IUploadProjectionReturns,
    @inject(IStorageServiceId) private storageService: IStorageService,
  ) { }

  async getAllInvestorCampaignProjections(
    fetchInvestorCampaignProjectionsDTO: FetchInvestorCampaignProjectionsDTO,
  ) {
    const result = await this.projectionReturnsRepository.fetchProjectionsByInvestorCampaign(
      {
        paginationOptions: fetchInvestorCampaignProjectionsDTO.getPaginationOptions(),
        investorId: fetchInvestorCampaignProjectionsDTO.getInvestorId(),
        campaignId: fetchInvestorCampaignProjectionsDTO.getCampaignId(),
        entityId: fetchInvestorCampaignProjectionsDTO.getEntityId(),
      },
    );
    return result;
  }
  async getAllInvestorProjectionsWithPagination(
    fetchInvestorProjectionsDTOWithPagination: FetchInvestorProjectionsDTOWithPagination,
  ) {
    const result = await this.projectionReturnsRepository.fetchProjectionsByInvestorWithPagination(
      {
        paginationOptions: fetchInvestorProjectionsDTOWithPagination.getPaginationOptions(),
        investorId: fetchInvestorProjectionsDTOWithPagination.getInvestorId(),
      },
    );
    return result.getPaginatedData();
  }

  async getAllInvestorProjectionsWithoutPagination(
    fetchInvestorProjectionsDTOWithoutPagination: FetchInvestorProjectionsDTOWithoutPagination,
  ) {
    return this.projectionReturnsRepository.fetchProjectionsByInvestorWithoutPagination({
      investorId: fetchInvestorProjectionsDTOWithoutPagination.getInvestorId(),
    });
  }

  async getInvestorsProjections() {
    return this.projectionReturnsRepository.fetchInvestorsProjections();
  }

  async getAllInvestorsProjections() {
    return this.projectionReturnsRepository.fetchAllInvestorsProjections();
  }

  /**
   *
   * @param UploadProjectionReturnsDTO
   */
  async uploadProjectionReturns(uploadProjectionReturnsDTO: UploadProjectionReturnsDTO) {
    const { file, email } = uploadProjectionReturnsDTO;
    const response = await this.parseCsv(file);

    if (response['status'] === 'success' && response['dataRows'].length > 0) {
      if (!validateFileHeaders(response['dataRows'][0], uploadProjectionReturnsFileHeaders)) {
        return { status: 'error', message: "Invalid headers in the file" }
      }
      const uploadProjectionReturnsEventHandler = UploadProjectionReturnsEventHandler(this.uploadProjectionReturnsUseCase);
      uploadProjectionReturnsEventHandler.emit('projectionReturns', response['dataRows'], email);
      return { status: 'success', message: 'File uploaded successfully, you will shortly receive slack notification about upload status.' }
    } else if (response['status'] === 'success' && response['dataRows'].length === 0) {
      return { status: 'success', message: 'No Data found in the file' };
    } else {
      return { status: 'error', message: 'Error processing the file' };
    }
  }

  async deleteCampaignsProjectionReturns(campaignIds) {
    const investorPayments = await this.investorPaymentsRepository.fetchAllInvestorPaymentsByCampaignIds(campaignIds);

    const investorPaymentsIds = investorPayments.map((payment) => payment.investorPaymentsId);
    if (investorPaymentsIds.length === 0) {
      return "No investor payments found for the given campaign Ids";
    }

    await this.projectionReturnsRepository.deleteProjectionReturnsByInvestorPaymentIds(investorPaymentsIds);
    await this.investorPaymentsRepository.deleteInvestorPaymentsByIds(investorPaymentsIds);

    this.slackService.publishMessage({
      message: `Projection returns deleted for Campaigns: ${campaignIds}`,
      slackChannelId: slackConfig.EMPLOYEE_ACTIVITY.ID,
    });
    return "Projection Returns deleted successfully.";
  }

  async getUploadProjectionReturnsTemplate(): Promise<any> {
      const fileBuffer = await this.storageService.getFileBuffer("templates/uploadProjectionReturnsTemplate.csv")
      return fileBuffer.toString('utf-8');
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

export default ProjectionReturnsService;
