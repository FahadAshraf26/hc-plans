import GetCampainQADTO from '../../Application/CampaignQA/GetCampaignQADTO';
import FindCampainQADTO from '../../Application/CampaignQA/FindCampaignQADTO';
import UpdateCampainQADTO from '../../Application/CampaignQA/UpdateCampaignQADTO';
import RemoveCampainQADTO from '../../Application/CampaignQA/RemoveCampaignQADTO';
import CreateCampainQADTO from '../../Application/CampaignQA/CreateCampaignQADTO';
import { inject, injectable } from 'inversify';
import {
  ICampaignQAService,
  ICampaignQAServiceId,
} from '@application/CampaignQA/ICampaignQAService';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */

@injectable()
class CampaignQAController {
  constructor(
    @inject(ICampaignQAServiceId) private campaignQAService: ICampaignQAService,
  ) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getCampaignQA = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const { page, perPage, showTrashed } = httpRequest.query;

    const input = new GetCampainQADTO(campaignId, page, perPage, showTrashed);
    const campaignQA = await this.campaignQAService.getCampaignQA(input);

    return { body: campaignQA };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findCampaignQA = async (httpRequest) => {
    const { campaignQAId } = httpRequest.params;

    const input = new FindCampainQADTO(campaignQAId);
    const campaignQA = await this.campaignQAService.findCampaignQA(input);

    return {
      body: {
        status: 'success',
        data: campaignQA,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updateCampaignQA = async (httpRequest) => {
    const { campaignId, campaignQAId } = httpRequest.params;
    const { body } = httpRequest;

    const input = new UpdateCampainQADTO({
      ...body,
      campaignId,
      campaignQAId,
    });
    await this.campaignQAService.updateCampaignQA(input);

    return {
      body: {
        status: 'success',
        message: 'campaign qa updated successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeCampaignQA = async (httpRequest) => {
    const { campaignQAId } = httpRequest.params;
    const { hardDelete } = httpRequest.query;

    const input = new RemoveCampainQADTO(campaignQAId, hardDelete);
    await this.campaignQAService.removeCampaignQA(input);

    return {
      body: {
        status: 'success',
        message: 'campaign qa deleted successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createCampaignQA = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const { userId, parentId, type, text } = httpRequest.body;

    const input = new CreateCampainQADTO(campaignId, userId, parentId, type, text);
    await this.campaignQAService.createCampaignQA(input);

    return {
      body: {
        status: 'success',
        message: 'campaign QA created sucessfully',
      },
    };
  };
}

export default CampaignQAController;
