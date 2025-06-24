import CreateCampaignRiskDTO from '../../Application/CampaignRisk/CreateCampaignRiskDTO';
import GetCampaignRiskDTO from '../../Application/CampaignRisk/GetCampaignRiskDTO';
import FindCampaignRiskDTO from '../../Application/CampaignRisk/FindCampaignRiskDTO';
import UpdateCampaignRiskDTO from '../../Application/CampaignRisk/UpdateCampaignRiskDTO';
import RemoveCampaignRiskDTO from '../../Application/CampaignRisk/RemoveCampaignRiskDTO';
import { injectable, inject } from 'inversify';
import {
  ICampaignRiskServiceId,
  ICampaignRiskService,
} from '@application/CampaignRisk/ICampaignRiskService';
/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */
@injectable()
class CampaignRiskController {
  constructor(
    @inject(ICampaignRiskServiceId) private campaignRiskService: ICampaignRiskService,
  ) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createCampaignRisk = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const { title, description } = httpRequest.body;

    const createCampaignRiskDTO = new CreateCampaignRiskDTO(
      campaignId,
      title,
      description,
    );
    await this.campaignRiskService.createCampaignRisk(createCampaignRiskDTO);

    return {
      body: {
        status: 'success',
        message: 'Campaign Risk Created Successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getCampaignRisk = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const { page, perPage, showTrashed, q } = httpRequest.query;

    const getCampaignRiskDTO = new GetCampaignRiskDTO(
      campaignId,
      page,
      perPage,
      showTrashed,
      q,
    );
    const campaignRisk = await this.campaignRiskService.getCampaignRisk(
      getCampaignRiskDTO,
    );

    return { body: campaignRisk };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findCampaignRisk = async (httpRequest) => {
    const { campaignRiskId } = httpRequest.params;

    const findCampaignRiskDTO = new FindCampaignRiskDTO(campaignRiskId);
    const campaignRisk = await this.campaignRiskService.findCampaignRisk(
      findCampaignRiskDTO,
    );

    return {
      body: {
        status: 'success',
        data: campaignRisk,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updateCampaignRisk = async (httpRequest) => {
    const { campaignId, campaignRiskId } = httpRequest.params;
    const { body } = httpRequest;

    const updateCampaignRiskDTO = new UpdateCampaignRiskDTO({
      campaignId,
      campaignRiskId,
      ...body,
    });
    await this.campaignRiskService.updateCampaignRisk(updateCampaignRiskDTO);

    return {
      body: {
        status: 'success',
        message: 'Campaign Risk Updated Successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeCampaignRisk = async (httpRequest) => {
    const { campaignRiskId } = httpRequest.params;
    const { hardDelete } = httpRequest.query;

    const removeCampaignRiskDTO = new RemoveCampaignRiskDTO(campaignRiskId, hardDelete);
    await this.campaignRiskService.removeCampaignRisk(removeCampaignRiskDTO);

    return {
      body: {
        status: 'success',
        message: 'Campaign Risk Deleted Successfully',
      },
    };
  };
}

export default CampaignRiskController;
