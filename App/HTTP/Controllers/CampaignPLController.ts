import GetPLDTO from '@application/CampaignPL/GetCampaignPLDTO';
import FindPLDTO from '@application/CampaignPL/FindCampaignPLDTO';
import UpdatePLDTO from '@application/CampaignPL/UpdateCampaignPLDTO';
import RemovePLDTO from '@application/CampaignPL/RemoveCampaignPLDTO';
import CreatePLDTO from '@application/CampaignPL/CreateCampaignPLDTO';
import { inject, injectable } from 'inversify';
import {
  ICampaignPLService,
  ICampaignPLServiceId,
} from '@application/CampaignPL/ICampaignPLService';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */
@injectable()
class CampaignPLController {
  constructor(
    @inject(ICampaignPLServiceId) private campaignPlService: ICampaignPLService,
  ) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getPL = async (httpRequest) => {
    const { campaignId } = httpRequest.params;

    const input = new GetPLDTO(campaignId);
    const pl = await this.campaignPlService.getPL(input);

    return {
      body: {
        status: 'success',
        data: pl,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findPL = async (httpRequest) => {
    const { plId } = httpRequest.params;

    const input = new FindPLDTO(plId);
    const pl = await this.campaignPlService.findPL(input);

    return {
      body: {
        status: 'success',
        data: pl,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updatePL = async (httpRequest) => {
    const { campaignId, plId } = httpRequest.params;
    const { body } = httpRequest;
    const input = new UpdatePLDTO({
      plId,
      pl: [...body],
      campaignId,
    });
    await this.campaignPlService.updatePL(input);

    return {
      body: {
        status: 'success',
        message: 'campaign pl updated successfully',
      },
    };
  };
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removePL = async (httpRequest) => {
    const { plId } = httpRequest.params;
    const { hardDelete = false } = httpRequest.query;

    const input = new RemovePLDTO(plId, hardDelete);
    await this.campaignPlService.removePL(input);

    return {
      body: {
        status: 'success',
        message: 'campaign pl deleted successfully',
      },
    };
  };
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createPL = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const { body } = httpRequest;

    const input = new CreatePLDTO(body, campaignId);
    await this.campaignPlService.createPL(input);

    return {
      body: {
        status: 'success',
        message: 'campaign pl create successfully',
      },
    };
  };
}

export default CampaignPLController;
