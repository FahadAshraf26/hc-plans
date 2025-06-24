import GetCampaignNewsDTO from '../../Application/CampaignNews/GetCampaignNewsDTO';
import FindCampaignNewsDTO from '../../Application/CampaignNews/FindCampaignNewsDTO';
import UpdateCampaignNewsDTO from '../../Application/CampaignNews/UpdateCampaignNewsDTO';
import RemoveCampaignNewsDTO from '../../Application/CampaignNews/RemoveCampaignNewsDTO';
import CreateCampaignNewsDTO from '../../Application/CampaignNews/CreateCampaignNewsDTO';
import { inject, injectable } from 'inversify';
import {
  ICampaignNewsService,
  ICampaignNewsServiceId,
} from '@application/CampaignNews/ICampaignNewsService';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */
@injectable()
class CampaignNewsController {
  constructor(
    @inject(ICampaignNewsServiceId) private campaignNewsService: ICampaignNewsService,
  ) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getCampaignNews = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const { page, perPage, showTrashed, q } = httpRequest.query;

    const input = new GetCampaignNewsDTO(campaignId, page, perPage, showTrashed, q);
    const campaignNews = await this.campaignNewsService.getCampaignNews(input);

    return { body: campaignNews };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findCampaignNews = async (httpRequest) => {
    const { campaignNewsId } = httpRequest.params;

    const input = new FindCampaignNewsDTO(campaignNewsId);
    const campaignNews = await this.campaignNewsService.findCampaignNews(input);

    return {
      body: {
        status: 'success',
        data: campaignNews,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updateCampaignNews = async (httpRequest) => {
    const { campaignNewsId } = httpRequest.params;
    const { body } = httpRequest;
    const input = new UpdateCampaignNewsDTO({ ...body, campaignNewsId });
    if (body.campaignMedia) {
      const campaignMedia =
        typeof body.campaignMedia === 'string'
          ? JSON.parse(body.campaignMedia)
          : body.campaignMedia;
      campaignMedia.forEach((mediaObj) => input.setMedia(mediaObj));
    }
    if (httpRequest.files) {
      httpRequest.files.forEach((mediaObj) => {
        input.setMedia(mediaObj);
      });
    }
    await this.campaignNewsService.updateCampaignNews(input);

    return {
      body: {
        status: 'success',
        message: 'campaign news updated sucessfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeCampaignNews = async (httpRequest) => {
    const { campaignNewsId } = httpRequest.params;
    const { hardDelete } = httpRequest.query;

    const input = new RemoveCampaignNewsDTO(campaignNewsId, hardDelete);
    await this.campaignNewsService.removeCampaignNews(input);

    return {
      body: {
        status: 'success',
        message: 'campaign  news deleted successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createCampaignNews = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const { title, description, media, hyperLink, hyperLinkText } = httpRequest.body;

    const input = new CreateCampaignNewsDTO(
      campaignId,
      title,
      description,
      hyperLink,
      hyperLinkText,
    );

    if (httpRequest.files) {
      httpRequest.files.forEach((mediaObj) => {
        input.setMedia(mediaObj);
      });
    }

    await this.campaignNewsService.createCampaignNews(input);

    return {
      body: {
        status: 'success',
        message: 'campaign news created successfully',
      },
    };
  };
}

export default CampaignNewsController;
