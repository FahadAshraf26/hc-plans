import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import {
  IRepaymentsRepositoryId,
  IRepaymentsRepository,
} from '@domain/Core/Repayments/IRepaymentsRepository';
import { inject, injectable } from 'inversify';
import FetchRepaymentsByInvestorIdDTO from './FetchRepaymentsByInvestorIdDTO';
import { IRepaymentsService } from './IRepaymentsService';
import HttpException from '@infrastructure/Errors/HttpException';
import { FethAllCompletedRepaymentsDTO } from './FetchAllCompletedRepaymentsDTO';
import UploadProjectionReturnsDTO from '@application/ProjectionReturns/UploadProjectionReturnsDTO';
import logger from '@infrastructure/Logger/logger';
import fs from 'fs';
import path from 'path';
import * as csv from 'fast-csv';
import { UploadRepaymentsEventHandler } from './RepaymentsUploadEventHandler';
import { IUploadRepayments, IUploadRepaymentsId } from './RepaymentsUploadEventHandler/IUploadRepayments';
import { ISlackService, ISlackServiceId } from '@infrastructure/Service/Slack/ISlackService';
import config from '@infrastructure/Config';
import { validateFileHeaders } from '@infrastructure/Utils/validateFileHeaders';
import { uploadRepaymentsFileHeaders } from '@infrastructure/Utils/uploadRepaymentsFileHeaders';
import { IStorageService, IStorageServiceId } from '@infrastructure/Service/StorageService/IStorageService';

const {slackConfig} = config;

@injectable()
class RepaymentsService implements IRepaymentsService {
  constructor(
    @inject(IRepaymentsRepositoryId) private repaymentsRepository: IRepaymentsRepository,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IUploadRepaymentsId) private uploadRepaymentsUseCase: IUploadRepayments,
    @inject(ISlackServiceId) private slackService: ISlackService,
    @inject(IStorageServiceId) private storageService: IStorageService,
  ) { }

  async getRepaymentsByInvestorId(
    fetchByInvestorIdDTO: FetchRepaymentsByInvestorIdDTO,
  ): Promise<any> {
    const user = await this.userRepository.fetchById(fetchByInvestorIdDTO.getUserId());
    if (!user) {
      throw new HttpException(404, 'no user found with the provided input');
    }
    const { investorId } = user.investor;
    const repayments = await this.repaymentsRepository.fetchByInvestorId(investorId);

    return repayments;
  }

  async getAllCompletedRepayments(
    fetchAllCompletedRepaymetsDTO: FethAllCompletedRepaymentsDTO,
  ) {
    const result = await this.repaymentsRepository.fetchByInvestorCampaign({
      paginationOptions: fetchAllCompletedRepaymetsDTO.getPaginationOptions(),
      investorId: fetchAllCompletedRepaymetsDTO.getInvestorId(),
      campaignId: fetchAllCompletedRepaymetsDTO.getCampaignId(),
      entityId: fetchAllCompletedRepaymetsDTO.getEntityId()
    });

    return result.getPaginatedData();
  }

  async getInvestorsRepayments() {
    return this.repaymentsRepository.fetchInvestorsRepayments();

  }

  async deleteAllRepayments(campaignIds: string[]): Promise<any> {
    const response = await this.repaymentsRepository.deleteAllRepayments(campaignIds);
    if(response){
      this.slackService.publishMessage({
        message: `Repayments deleted Successfully: ${campaignIds}`,
        slackChannelId: slackConfig.EMPLOYEE_ACTIVITY.ID,
      });
    }
    return "Repayments deleted Successfully";
  }

  async uploadRepayments(repaymentsFile: UploadProjectionReturnsDTO): Promise<any> {
    const { file, email } = repaymentsFile;
    const parsedCsv = await this.parseCsv(file);

    if (parsedCsv['status'] === 'success' && parsedCsv['dataRows'].length > 0) {
      if(!validateFileHeaders(parsedCsv['dataRows'][0], uploadRepaymentsFileHeaders)){
        return {status: 'error', message: "Invalid headers in the file"};
      }
      const uploadRepaymentsEventHandler = UploadRepaymentsEventHandler(this.uploadRepaymentsUseCase);
      uploadRepaymentsEventHandler.emit('uploadRepayments', parsedCsv['dataRows'], email);
      return {status: 'success', message: 'File uploaded successfully, you will shortly receive slack notification about upload status.'}
    } else if(parsedCsv['status'] === 'success' && parsedCsv['dataRows'].length === 0){
      return { status: 'success', message: 'No Data found in the file' };
    } else {
      return { status: 'error', message: 'Error processing the file' };
    }
  }

  async getUploadRepaymentsTemplate(): Promise<any>{
    const fileBuffer = await this.storageService.getFileBuffer("templates/uploadRepaymentsTemplate.csv");
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

export default RepaymentsService;
