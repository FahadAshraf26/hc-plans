import { inject, injectable } from 'inversify';
import GetRoughBudgetDTO from '@application/CampaignRoughBudget/GetCampaignRoughBudgetDTO';
import FindRoughBudgetDTO from '@application/CampaignRoughBudget/FindCampaignRoughBudgetDTO';
import UpdateRoughBudgetDTO from '@application/CampaignRoughBudget/UpdateCampaignRoughBudgetDTO';
import RemoveRoughBudgetDTO from '@application/CampaignRoughBudget/RemoveCampaignRoughBudgetDTO';
import CreateRoughBudgetDTO from '@application/CampaignRoughBudget/CreateCampaignRoughBudgetDTO';
import {
  ICampaignRoughBudgetService,
  ICampaignRoughBudgetServiceId,
} from '@application/CampaignRoughBudget/ICampaignRoughBudgetService';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */
@injectable()
class CampaignRoughBudgetController {
  constructor(
    @inject(ICampaignRoughBudgetServiceId)
    private campaignRoughBudgetService: ICampaignRoughBudgetService,
  ) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getRoughBudget = async (httpRequest) => {
    const { campaignId } = httpRequest.params;

    const input = new GetRoughBudgetDTO(campaignId);
    const roughBudget = await this.campaignRoughBudgetService.getRoughBudget(input);

    return {
      body: {
        status: 'success',
        data: roughBudget,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findRoughBudget = async (httpRequest) => {
    const { roughBudgetId } = httpRequest.params;

    const input = new FindRoughBudgetDTO(roughBudgetId);
    const roughBudget = await this.campaignRoughBudgetService.findRoughBudget(input);

    return {
      body: {
        status: 'success',
        data: roughBudget,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updateRoughBudget = async (httpRequest) => {
    const { campaignId, roughBudgetId } = httpRequest.params;
    const { body } = httpRequest;
    const input = new UpdateRoughBudgetDTO({
      roughBudgetId,
      roughBudget: { ...body },
      campaignId,
    });

    await this.campaignRoughBudgetService.updateRoughBudget(input);

    return {
      body: {
        status: 'success',
        message: 'rough budget updated successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeRoughBudget = async (httpRequest) => {
    const { roughBudgetId } = httpRequest.params;
    const { hardDelete = false } = httpRequest.query;

    const input = new RemoveRoughBudgetDTO(roughBudgetId, hardDelete);
    await this.campaignRoughBudgetService.removeRoughBudget(input);

    return {
      body: {
        status: 'success',
        message: 'rough budget deleted successfully',
      },
    };
  };

  /**
   * create info for a campaign
   * @param {object}httpRequest
   * @param {object}res
   */
  createRoughBudget = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const { body } = httpRequest;

    const input = new CreateRoughBudgetDTO(body, campaignId);
    await this.campaignRoughBudgetService.createRoughBudget(input);

    return {
      body: {
        status: 'success',
        message: 'rough budget create successfully',
      },
    };
  };
}

export default CampaignRoughBudgetController;
