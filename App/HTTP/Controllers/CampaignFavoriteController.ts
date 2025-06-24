import GetCampaignFavoriteDTO from '../../Application/CampaignFavorite/GetCampaignFavoriteDTO';
import FindCampaignFavoriteDTO from '../../Application/CampaignFavorite/FindCampaignFavoriteDTO';
import RemoveCampaignFavoriteDTO from '../../Application/CampaignFavorite/RemoveCampaignFavoriteDTO';
import CreateCampaignFavoriteDTO from '../../Application/CampaignFavorite/CreateCampaignFavoriteDTO';
import RemoveByInvestorDTO from '../../Application/CampaignFavorite/RemoveByInvestorDTO';
import { inject, injectable } from 'inversify';
import {
  ICampaignFavoriteServiceId,
  ICampaignFavoriteService,
} from '@application/CampaignFavorite/ICampaignFavoriteService';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */
@injectable()
class CampaignFavoriteController {
  constructor(
    @inject(ICampaignFavoriteServiceId)
    private campaignFavoriteService: ICampaignFavoriteService,
  ) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createCampaignFavorite = async (httpRequest) => {
    const { investorId } = httpRequest.body;
    const { campaignId } = httpRequest.params;

    const input = new CreateCampaignFavoriteDTO(campaignId, investorId);
    await this.campaignFavoriteService.createCampaignFavorite(input);

    return {
      body: {
        status: 'success',
        message: "campaign added to investor's favorites successfully",
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findCampaignFavorite = async (httpRequest) => {
    const { favoriteCampaignId } = httpRequest.params;

    const input = new FindCampaignFavoriteDTO(favoriteCampaignId);
    const favoriteCamapign = await this.campaignFavoriteService.findCampaignFavorite(
      input,
    );

    return {
      body: {
        status: 'message',
        data: favoriteCamapign,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeCampaignFavorite = async (httpRequest) => {
    const { favoriteCampaignId } = httpRequest.params;
    const { hardDelete, investorId } = httpRequest.query;

    const input = new RemoveCampaignFavoriteDTO(favoriteCampaignId, hardDelete);
    await this.campaignFavoriteService.removeCampaignFavorite(input);

    return {
      body: {
        status: 'success',
        message: 'campaign removed from favorites successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeByInvestor = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const { investorId } = httpRequest.decoded;

    const input = new RemoveByInvestorDTO(campaignId, investorId);
    await this.campaignFavoriteService.removeByInvestor(input);

    return {
      body: {
        status: 'success',
        message: 'campaign removed from favorites successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getCampaignFavorite = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const { page, perPage, showTrashed } = httpRequest.query;

    const input = new GetCampaignFavoriteDTO(campaignId, page, perPage, showTrashed);
    const favoriteCamapigns = await this.campaignFavoriteService.getCampaignFavorite(
      input,
    );

    return { body: favoriteCamapigns };
  };
}

export default CampaignFavoriteController;
