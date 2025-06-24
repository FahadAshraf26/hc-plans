import { inject, injectable } from 'inversify';

import ReconfirmOfferingChangeDTO from '@application/CampaignOfferingChange/ReconfirmOfferingChangeDTO';
import TriggerOfferingChangesDTO from '@application/Campaign/TriggerOfferingChangesDTO';
import HttpException from '../../Infrastructure/Errors/HttpException';
import {
  ICampaignOfferingChangeService,
  ICampaignOfferingChangeServiceId,
} from '@application/CampaignOfferingChange/ICampaignOfferingChangeService';
import CampaignOfferingChangeService from '@application/CampaignOfferingChange/CampaignOfferingChangeService';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */

@injectable()
class CampaignOfferingChangeController {
  constructor(
    @inject(ICampaignOfferingChangeServiceId)
    private campaignOfferingChangeService: ICampaignOfferingChangeService,
  ) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  reconfirmCampaignOfferingChange = async (httpRequest) => {
    const { campaignOfferingChangeId } = httpRequest.params;

    const input = new ReconfirmOfferingChangeDTO(campaignOfferingChangeId);
    const html = await this.campaignOfferingChangeService.reconfirmCampaignOfferingChange(
      input,
    );

    return {
      body: html,
      headers: {
        'Content-Type': 'text/html',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  triggerOfferedChanges = async (httpRequest) => {
    const { campaignId } = httpRequest.params;

    if (!campaignId) {
      throw new HttpException(400, 'CampaignId not found');
    }
    const input = new TriggerOfferingChangesDTO(campaignId);
    await this.campaignOfferingChangeService.triggerOfferingChanges(input);

    return {
      body: {
        status: 'success',
        message: 'Emails will be sent one by one to all investors',
      },
    };
  };
}

export default CampaignOfferingChangeController;
