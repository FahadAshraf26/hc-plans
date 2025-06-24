import CampaignMediaService from '../../Application/CampaignMedia/CampaignMediaService';
import GetCampaignMediasDTO from '../../Application/CampaignMedia/GetCampaignMediaDTO';
import FindCampaignMediaDTO from '../../Application/CampaignMedia/FindCampaignMediaDTO';
import RemoveCampaignMediaDTO from '../../Application/CampaignMedia/RemoveCampaignMediaDTO';
import CreateCampaignMediaDTO from '../../Application/CampaignMedia/CreateCampaignMediaDTO';
import { injectable } from 'inversify';
import UpdateCampaignMediaDTO from '@application/CampaignMedia/UpdateCampaignMediaDTO';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */
@injectable()
class CampaignMediaController {
  constructor(private campaignMediaService: CampaignMediaService) {}

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getCampaignMedia = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const { page, perPage, showTrashed } = httpRequest.query;

    const input = new GetCampaignMediasDTO(campaignId, page, perPage, showTrashed);
    const campaignMedia = await this.campaignMediaService.getCampaignMedia(input);

    return { body: campaignMedia };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findCampaignMedia = async (httpRequest) => {
    const { campaignMediaId } = httpRequest.params;

    const input = new FindCampaignMediaDTO(campaignMediaId);
    const campaignMedia = await this.campaignMediaService.findCampaignMedia(input);

    return {
      body: {
        status: 'success',
        data: campaignMedia,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeCampaignMedia = async (httpRequest) => {
    const { campaignMediaId } = httpRequest.params;
    const { hardDelete = false } = httpRequest.query;

    const input = new RemoveCampaignMediaDTO(campaignMediaId, hardDelete);
    await this.campaignMediaService.removeCampaignMedia(input);

    return {
      body: {
        status: 'success',
        message: 'campaign media deleted successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createCampaignMedia = async (httpRequest) => {
    const { campaignId } = httpRequest.params;

    const input = new CreateCampaignMediaDTO(campaignId);
    if (httpRequest.files) {
      httpRequest.files.forEach((file) => {
        input.setMedia(file);
      });
    } else {
      httpRequest.body.map((item) => {
        input.setVideoLink(item);
      });
    }

    await this.campaignMediaService.createCampaignMedia(input);

    return {
      body: {
        status: 'success',
        message: 'campaign media created successfully',
      },
    };
  };

  updateCampaignMedia = async (httpRequest) => {
    const input = new UpdateCampaignMediaDTO(httpRequest.body);
    await this.campaignMediaService.updateCampaignMedia(input);
    return {
      body: {
        status: 'success',
        message: 'campaign media updated successfully',
      },
    };
  };
}

export default CampaignMediaController;
