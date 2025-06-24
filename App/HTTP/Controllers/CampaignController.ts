import {
  ISendSubscriptionDocumentsUseCaseId,
  ISendSubscriptionDocumentsUseCase,
} from '@application/Campaign/sendSubscriptionDocuments/ISendSubscriptionDocumentsUseCase';
import { inject, injectable } from 'inversify';
import GetAllCampaignsByIssuerDTO from '@application/Campaign/GetAllCampaignsByIssuerDTO';
import GetFavoriteCampaignDTIO from '@application/Campaign/GetFavoriteCampaignDTO';
import GetAllCampaignsDTO from '../../Application/Campaign/getAllCampaigns/GetAllCampaignsDTO';
import FindCampaignDTO from '@application/Campaign/findCampaign/FindCampaignDTO';
import UpdateCampaignDTO from '../../Application/Campaign/UpdateCampaignDTO';
import RemoveCampaignDTO from '../../Application/Campaign/RemoveCampaignDTO';
import CreateCampaignDTO from '@application/Campaign/createCampaign/CreateCampaignDTO';
import DetermineCampaignStatusDTO from '@application/Campaign/DetermineCampaignStatusDTO';
import PublicOppurtunitiesDTO from '@application/Campaign/PublicOppurtunitiesDTO';
import FindCampaignInfoDTO from '@application/Campaign/findCampaignInfo/FindCampaignInfoDTO';
import GetOwnerCampaignDTO from '../../Application/Campaign/getOwnerCampaign/GetOwnerCampaignDTO';
import FindCampaignBySlugDTO from '@application/Campaign/FindCampaignBySlugDTO';
import {
  IGetAllCampaignsUseCase,
  IGetAllCampaignsUseCaseId,
} from '@application/Campaign/getAllCampaigns/IGetAllCampaignsUseCase';
import {
  IFindCampaignUseCase,
  IFindCampaignUseCaseId,
} from '@application/Campaign/findCampaign/IFindCampaignUseCase';
import {
  IGetOwnerCampaignUseCase,
  IGetOwnerCampaignUseCaseId,
} from '@application/Campaign/getOwnerCampaign/IGetOwnerCampaignUseCase';
import {
  ICreateCampaignUseCase,
  ICreateCampaignUseCaseId,
} from '@application/Campaign/createCampaign/ICreateCampaignUseCase';
import {
  IFindCampaignInfoUseCase,
  IFindCampaignInfoUseCaseId,
} from '@application/Campaign/findCampaignInfo/IFindCampaignInfoUseCase';
import {
  ICampaignService,
  ICampaignServiceId,
} from '@application/Campaign/ICampaignService';
import SendSubscriptionDocumentsDTO from '@application/Campaign/sendSubscriptionDocuments/SendSubscriptionDocumentsDTO';
import GetCampaignsWithRepaymentsDTO from '@application/Campaign/GetCampaignsWithRepaymentsDTO';
import GetCampaignsWithProjectionReturnsDTO from '@application/Campaign/GetCampaignsWithProjectionReturnsDTO';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */
@injectable()
class CampaignController {
  constructor(
    @inject(IGetOwnerCampaignUseCaseId)
    private getOwnerCampaignUseCase: IGetOwnerCampaignUseCase,
    @inject(IGetAllCampaignsUseCaseId)
    private getAllCampaignsUseCase: IGetAllCampaignsUseCase,
    @inject(IFindCampaignUseCaseId) private findCampaignUseCase: IFindCampaignUseCase,
    @inject(ICreateCampaignUseCaseId)
    private createCampaignUseCase: ICreateCampaignUseCase,
    @inject(IFindCampaignInfoUseCaseId)
    private findCampaignInfoUseCase: IFindCampaignInfoUseCase,
    @inject(ICampaignServiceId) private campaignService: ICampaignService,
    @inject(ISendSubscriptionDocumentsUseCaseId)
    private sendSubscriptionDocumentsUseCase: ISendSubscriptionDocumentsUseCase,
  ) {}

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getAllCampaigns = async (httpRequest: {
    query: { page: number; perPage: number; showTrashed: boolean };
    params: { issuerId: string };
    decoded: { investorId: string };
  }) => {
    const { page, perPage, showTrashed } = httpRequest.query;
    const { issuerId } = httpRequest.params;
    const { investorId } = httpRequest.decoded;

    const input = new GetAllCampaignsByIssuerDTO(
      issuerId,
      investorId,
      page,
      perPage,
      showTrashed,
    );

    const campaigns = await this.campaignService.getAllCampaignsByIssuer(input);

    return { body: campaigns };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getFavoriteCampaigns = async (httpRequest) => {
    const { page, perPage, showTrashed } = httpRequest.query;
    const { investorId } = httpRequest.params;
    const input = new GetFavoriteCampaignDTIO(investorId, page, perPage, showTrashed);

    const favoriteCampaign = await this.campaignService.getFavoriteCampaign(input);

    return { body: favoriteCampaign };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getCampaigns = async (httpRequest) => {
    const {
      page,
      perPage,
      showTrashed,
      campaignStage,
      investorId,
      showFailed,
      requestOrigin,
      search,
      tags,
      sortBy,
      sortPriority,
    } = httpRequest.query;
    const input = new GetAllCampaignsDTO({
      page,
      perPage,
      campaignStage,
      investorId,
      showTrashed,
      showFailed,
      requestOrigin,
      search,
      tags,
      sortBy,
      sortPriority,
    });
    const campaigns = await this.getAllCampaignsUseCase.execute(input);

    return { body: campaigns };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findCampaign = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const { investorId } = httpRequest.query;

    const input = new FindCampaignDTO(campaignId, undefined, investorId);
    const campaign = await this.findCampaignUseCase.execute(input);

    return {
      body: {
        status: 'success',
        data: campaign,
      },
    };
  };

  getFCCampaignIdAndNames = async (httpRequest) => {
    const result = await this.campaignService.getAllFCCampaigns();
    return {
      body: {
        status: 'success',
        data: result,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updateCampaign = async (httpRequest) => {
    const { issuerId, campaignId } = httpRequest.params;
    const { body } = httpRequest;
    const campaign = {
      ...body,
      campaignId,
      issuerId,
    };
    const input = new UpdateCampaignDTO(
      campaign,
      httpRequest.clientIp || httpRequest.body.ip,
      httpRequest.file,
    );

    if (body.tags) {
      for (const tagObj of body.tags) {
        input.setCampaignTag(tagObj);
      }
    }

    if (httpRequest.body.interestedInvestors) {
      for (const investorObj of httpRequest.body.interestedInvestors) {
        input.setCampaignInterestedInvestor(investorObj);
      }
    }

    await this.campaignService.updateCampaign(input);

    return {
      body: {
        status: 'success',
        message: 'campaign updated successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeCampaign = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const { hardDelete = false } = httpRequest.query;

    const input = new RemoveCampaignDTO(campaignId, hardDelete);
    await this.campaignService.removeCampaign(input);

    return {
      body: {
        status: 'success',
        message: 'campaign deleted successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createCampaign = async (httpRequest) => {
    const { issuerId } = httpRequest.params;
    const input = new CreateCampaignDTO(
      httpRequest.body,
      issuerId,
      httpRequest.clientIp || httpRequest.body.ip,
      httpRequest.file,
    );

    if (httpRequest.body.tags) {
      for (const tagObj of httpRequest.body.tags) {
        input.setCampaignTag(tagObj);
      }
    }

    if (httpRequest.body.interestedInvestors) {
      for (const investorObj of httpRequest.body.interestedInvestors) {
        input.setCampaignInterestedInvestor(investorObj);
      }
    }

    await this.createCampaignUseCase.execute(input);

    return { body: { status: 'success', message: 'campaign created successfully' } };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getOwnerCampaigns = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const { page, perPage } = httpRequest.query;

    const input = new GetOwnerCampaignDTO(userId, page, perPage);
    const result = await this.getOwnerCampaignUseCase.execute(input);

    return { body: result };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  determineCampaignStatus = async (httpRequest) => {
    const { campaignId } = httpRequest.params;

    const input = new DetermineCampaignStatusDTO(campaignId);
    await this.campaignService.determineCampaignStatus(input);

    return {
      body: {
        status: 'success',
        message: 'campaign status updated successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  fetchPublicOppurtunities = async (httpRequest) => {
    const { page, perPage, showTrashed, campaignStage } = httpRequest.query;

    const input = new PublicOppurtunitiesDTO(campaignStage, page, perPage, showTrashed);
    const result = await this.campaignService.getPublicOppurtunities(input);

    return { body: result };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findCampaignInfo = async (httpRequest) => {
    const { campaignId } = httpRequest.params;

    const input = new FindCampaignInfoDTO(campaignId);
    const campaign = await this.findCampaignInfoUseCase.execute(input);

    return {
      body: {
        status: 'success',
        data: campaign,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findCampaignBySlug = async (httpRequest) => {
    const { slug } = httpRequest.params;
    const { investorId, requestOrigin } = httpRequest.query;

    const input = new FindCampaignBySlugDTO(slug, investorId, requestOrigin);
    const campaign = await this.campaignService.findCampaignBySlug(input);

    return {
      body: {
        status: 'success',
        data: campaign,
      },
    };
  };

  sendSubscriptionDocuments = async (httpRequest) => {
    const { campaignId } = httpRequest.params;

    const input = new SendSubscriptionDocumentsDTO(campaignId);
    const result = await this.sendSubscriptionDocumentsUseCase.execute(input);

    return {
      body: {
        status: 'success',
        data: result,
      },
    };
  };

  getCampaignsWithRepayments = async (httpRequest) => {
    const { page, perPage, search } = httpRequest.query;
    const getCampaignsWithRepaymentsDTO = new GetCampaignsWithRepaymentsDTO(
      search,
      page,
      perPage,
    );
    const campaigns = await this.campaignService.getCampaignsWithRepayments(
      getCampaignsWithRepaymentsDTO,
    );
    return {
      body: {
        status: 'success',
        data: campaigns,
      },
    };
  };

  getCampaignsWithProjectionReturns = async (httpRequest) => {
    const { page, perPage, search } = httpRequest.query;
    const getCampaignsWithProjectionReturnsDTO = new GetCampaignsWithProjectionReturnsDTO(
      search,
      page,
      perPage,
    );
    const campaigns = await this.campaignService.getCampaignsWithProjectionReturns(
      getCampaignsWithProjectionReturnsDTO,
    );
    return {
      body: {
        status: 'success',
        data: campaigns,
      },
    };
  };
}

export default CampaignController;
