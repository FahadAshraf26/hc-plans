import GetCampaignTagDTO from '../../Application/CampaignTag/GetCampaignTagDTO';
import FindCampaignTagDTO from '../../Application/CampaignTag/FindCampaignTagDTO';
import RemoveCampaignTagDTO from '../../Application/CampaignTag/RemoveCampaignTagDTO';
import CreateCampaignTagDTO from '../../Application/CampaignTag/CreateCampaignTagDTO';
import { injectable, inject } from 'inversify';
import {
  ICampaignTagService,
  ICampaignTagServiceId,
} from '@application/CampaignTag/ICamaignTagService';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */
@injectable()
class CampaignTagController {
  constructor(
    @inject(ICampaignTagServiceId) private campaignTagService: ICampaignTagService,
  ) {}

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getCampaignTag = async (httpRequest) => {
    const { page, perPage, showTrashed } = httpRequest.query;
    const { campaignId } = httpRequest.params;

    const input = new GetCampaignTagDTO(campaignId, page, perPage, showTrashed);
    const campaignTags = await this.campaignTagService.getCampaignTag(input);

    return { body: campaignTags };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findCampaignTag = async (httpRequest) => {
    const { campaignTagId } = httpRequest.params;

    const input = new FindCampaignTagDTO(campaignTagId);
    const campaignTag = await this.campaignTagService.findCampaignTag(input);

    return {
      body: {
        status: 'success',
        data: campaignTag,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeCampaignTag = async (httpRequest) => {
    const { campaignTagId } = httpRequest.params;
    const { hardDelete } = httpRequest.query;

    const input = new RemoveCampaignTagDTO(campaignTagId, hardDelete);
    await this.campaignTagService.removeCampaignTag(input);

    return {
      body: {
        status: 'success',
        message: 'campaign tag deleted successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createCampaignTag = async (httpRequest) => {
    const { tagIds } = httpRequest.body;
    const { campaignId } = httpRequest.params;

    const input = new CreateCampaignTagDTO(tagIds, campaignId);
    await this.campaignTagService.createCampaignTag(input);

    return {
      body: {
        status: 'success',
        message: 'campaign tag created successfully',
      },
    };
  };
}

export default CampaignTagController;
