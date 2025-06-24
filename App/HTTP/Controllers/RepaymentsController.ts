import {
  IRepaymentsServiceId,
  IRepaymentsService,
} from '@application/Repayments/IRepaymentsService';
import { inject, injectable } from 'inversify';
import FetchRepaymentsByInvestorIdDTO from '@application/Repayments/FetchRepaymentsByInvestorIdDTO';
import { FethAllCompletedRepaymentsDTO } from '@application/Repayments/FetchAllCompletedRepaymentsDTO';
import { IRepaymentExportDataUseCase, IRepaymentExportDataUseCaseId } from '@application/Repayments/RepaymentExportUseCase/IRepaymentExportDataUseCase';
import UploadRepaymentsDTO from '@application/Repayments/UploadRepaymentsDTO';

@injectable()
class RepaymentsController {
  constructor(
    @inject(IRepaymentsServiceId) private repaymentService: IRepaymentsService,
    @inject(IRepaymentExportDataUseCaseId) private repaymentExportDataUseCase:IRepaymentExportDataUseCase
  ) { }

  getAllInvestorRepayments = async (httpRequest) => {
    const { userId } = httpRequest.decoded;
    const input = new FetchRepaymentsByInvestorIdDTO(userId);
    const result = await this.repaymentService.getRepaymentsByInvestorId(input);
    return {
      body: {
        status: 'success',
        data: result,
      },
    };
  };

  getAllCompletedRepayments = async (httpRequest) => {
    const { page, perPage, campaignId } = httpRequest.query;
    const { investorId } = httpRequest.params;
    const input = new FethAllCompletedRepaymentsDTO(
      page,
      perPage,
      investorId,
      campaignId,
    );

    const CompeletedRepayments = await this.repaymentService.getAllCompletedRepayments(
      input,
    );

    return { body: CompeletedRepayments };
  };

  getAllEntityCompletedRepayments = async (httpRequest) => {
    const { page, perPage, campaignId } = httpRequest.query;
    const { investorId,entityId } = httpRequest.params;
    const input = new FethAllCompletedRepaymentsDTO(
      page,
      perPage,
      investorId,
      campaignId,
      entityId
    );

    const CompeletedRepayments = await this.repaymentService.getAllCompletedRepayments(
      input,
    );

    return { body: CompeletedRepayments };
  };

  getInvestorsRepayments = async (httpRequest) => {

    await this.repaymentExportDataUseCase.execute(httpRequest.adminUser)

    return {
      body: {
        status: 'success',
        message: 'We received your request. You will be notified when file generated!',
      },
    }
  }

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  uploadRepayments = async (httpRequest) => {
    const { adminUser } = httpRequest;
    const input = new UploadRepaymentsDTO(httpRequest.file, adminUser.email);
    const response = await this.repaymentService.uploadRepayments(input);
    return {
      body: response,
    };
  }

  deleteAllRepayments = async(httpRequest)=>{
    const campaignIds =httpRequest.body;
    const message = await this.repaymentService.deleteAllRepayments(campaignIds);
    return{
      body:{
        status: 'success',
        message: message,
      },
    };
  };

  getUploadRepaymentsTemplate = async ()=>{
    const file = await this.repaymentService.getUploadRepaymentsTemplate();
    return {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment: filename="uploadRepaymentsTemplate.csv"',
      },
      body:{
        file: file,
      } 
    }
  }
}

export default RepaymentsController;
