import CampaignInfoService from '@application/CampaignInfo/CampaignInfoService';
import GetCampaignInfoDTO from '@application/CampaignInfo/GetCampaignInfoDTO';
import FindCampaignInfoDTO from '@application/CampaignInfo/FindCampaignInfoDTO';
import UpdateCampaignInfoDTO from '@application/CampaignInfo/UpdateCampaignInfoDTO';
import RemoveCampaignInfoDTO from '@application/CampaignInfo/RemoveCampaignInfoDTO';
import CreateCampaignInfoDTO from '@application/CampaignInfo/CreateCampaignInfoDTO';
import { injectable } from 'inversify';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */

@injectable()
class CampaignInfoController {
  constructor(private campaignInfoService: CampaignInfoService) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getCampaignInfo = async (httpRequest) => {
    const { campaignId } = httpRequest.params;

    const input = new GetCampaignInfoDTO(campaignId);
    const campaignInfo = await this.campaignInfoService.getCampaignInfo(input);

    return {
      body: {
        status: 'success',
        data: campaignInfo,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findCampaignInfo = async (httpRequest) => {
    const { campaignInfoId } = httpRequest.params;

    const input = new FindCampaignInfoDTO(campaignInfoId);
    const campaignInfo = await this.campaignInfoService.findCampaignInfo(input);

    return {
      body: {
        status: 'success',
        data: campaignInfo,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updateCampaignInfo = async (httpRequest) => {
    const { campaignId, campaignInfoId } = httpRequest.params;
    const { body } = httpRequest;

    const input = new UpdateCampaignInfoDTO({
      campaignId,
      campaignInfoId,
      ...body,
    });

    await this.campaignInfoService.updateCampaignInfo(input);

    return {
      body: {
        status: 'success',
        message: 'campaign info updated successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeCampaignInfo = async (httpRequest) => {
    const { campaignInfoId } = httpRequest.params;
    const { hardDelete = false } = httpRequest.query;

    const input = new RemoveCampaignInfoDTO(campaignInfoId, hardDelete);
    await this.campaignInfoService.removeCampaignInfo(input);

    return {
      body: {
        status: 'success',
        message: 'campaign info deleted successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createCampaignInfo = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const {
      financialHistory,
      competitors,
      milestones,
      investorPitch,
      risks,
      target,
      isShowPitch,
      investorPitchTitle,
    } = httpRequest.body;

    const input = new CreateCampaignInfoDTO(
      campaignId,
      financialHistory,
      competitors,
      milestones,
      investorPitch,
      risks,
      target,
      isShowPitch,
      investorPitchTitle,
    );
    await this.campaignInfoService.createCampaignInfo(input);

    return {
      body: {
        status: 'success',
        message: 'campaign info create successfully',
      },
    };
  };
}

export default CampaignInfoController;
