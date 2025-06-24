import { FetchInvestorCampaignProjectionsDTO } from '@application/Investor/ProjectionReturns/FetchInvestorCampaignProjectionsDTO';
import { FetchInvestorProjectionsDTOWithPagination } from '@application/Investor/ProjectionReturns/FetchInvestorProjectionsDTOWithPagination';
import { FetchInvestorProjectionsDTOWithoutPagination } from '@application/Investor/ProjectionReturns/FetchInvestorProjectionsDTOWithoutPagination';
import {
  IProjectionReturnsServiceId,
  IProjectionReturnsService,
} from '@application/Investor/ProjectionReturns/IProjectionReturnsServcie';
import { inject, injectable } from 'inversify';
import {
  IExportInvestorRateOfReturnUseCase,
  IExportInvestorRateOfReturnUseCaseId,
} from '@application/Investor/IExportInvestorRateOfReturnUseCase';
import {
  IExportInvestorProjectionReturnsUseCase,
  IExportInvestorProjectionReturnsUseCaseId,
} from '@application/Investor/IExportInvestorProjectionReturnsUseCase';
import UploadProjectionReturnsDTO from '@application/ProjectionReturns/UploadProjectionReturnsDTO';
import DeleteProjectionReturnsDTO from '@application/ProjectionReturns/DeleteProjectionReturnsDTO';

@injectable()
class ProjectionReturnsController {
  constructor(
    @inject(IProjectionReturnsServiceId)
    private projectionReturnsService: IProjectionReturnsService,
    @inject(IExportInvestorRateOfReturnUseCaseId)
    private exportInvestorRateOfReturn: IExportInvestorRateOfReturnUseCase,
    @inject(IExportInvestorProjectionReturnsUseCaseId)
    private exportInvestorProjectionReturnUseCase: IExportInvestorProjectionReturnsUseCase,
  ) {}

  getAllInvestorCampaignProjectionsReturns = async (httpRequest) => {
    const { page, perPage, campaignId } = httpRequest.query;
    const { investorId } = httpRequest.params;

    const input = new FetchInvestorCampaignProjectionsDTO(
      page,
      perPage,
      investorId,
      campaignId,
    );
    const projectionReturns = await this.projectionReturnsService.getAllInvestorCampaignProjections(
      input,
    );
    return { body: { status: 'success', data: projectionReturns } };
  };

  getAllEntityInvestorCampaignProjectionsReturns = async (httpRequest) => {
    const { page, perPage, campaignId } = httpRequest.query;
    const { investorId, entityId } = httpRequest.params;

    const input = new FetchInvestorCampaignProjectionsDTO(
      page,
      perPage,
      investorId,
      campaignId,
      entityId,
    );
    const projectionReturns = await this.projectionReturnsService.getAllInvestorCampaignProjections(
      input,
    );
    return { body: { status: 'success', data: projectionReturns } };
  };

  getAllInvestorProjectionsReturnsWithPagination = async (httpRequest) => {
    const { page, perPage } = httpRequest.query;
    const { investorId } = httpRequest.params;

    const input = new FetchInvestorProjectionsDTOWithPagination(
      page,
      perPage,
      investorId,
    );
    const projectionReturns = await this.projectionReturnsService.getAllInvestorProjectionsWithPagination(
      input,
    );
    return { body: projectionReturns };
  };

  getAllInvestorProjectionsReturnsWithoutPagination = async (httpRequest) => {
    const { investorId } = httpRequest.params;

    const input = new FetchInvestorProjectionsDTOWithoutPagination(investorId);
    const projectionReturns = await this.projectionReturnsService.getAllInvestorProjectionsWithoutPagination(
      input,
    );

    return { body: { status: 'success', data: projectionReturns } };
  };

  getInvestorsProjections = async (httpRequest) => {
    await this.exportInvestorRateOfReturn.execute(httpRequest.adminUser);

    return {
      body: {
        status: 'success',
        message: 'We received your request. You will be notified when file generated!',
      },
    };
  };

  getAllInvestorsProjections = async (httpRequest) => {
    const result = await this.exportInvestorProjectionReturnUseCase.execute(
      httpRequest.adminUser,
    );

    return {
      body: {
        status: 'success',
        message: 'We received your request. You will be notified when file generated!',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  uploadProjectionReturns = async (httpRequest) => {
    const { adminUser } = httpRequest;
    const input = new UploadProjectionReturnsDTO(httpRequest.file, adminUser.email);
    const response = await this.projectionReturnsService.uploadProjectionReturns(input);

    return {
      body: response,
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  deleteCampaignsProjectionReturns = async (httpRequest) => {
    const campaignIds = httpRequest.body;
    const message = await this.projectionReturnsService.deleteCampaignsProjectionReturns(
      campaignIds,
    );
    return {
      body: {
        status: 'success',
        message: message,
      },
    };
  };

  getUploadProjectionReturnsTemplate = async ()=>{
    const file = await this.projectionReturnsService.getUploadProjectionReturnsTemplate();
    return{
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

export default ProjectionReturnsController;
