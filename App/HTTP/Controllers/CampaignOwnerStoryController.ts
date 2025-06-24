import CreateCampaignOwnerStoryDTO from '../../Application/CampaignOwnerStory/CreateCampaignOwnerStoryDTO';
import GetCampaignOwnerStoryDTO from '../../Application/CampaignOwnerStory/GetCampaignOwnerStoryDTO';
import GetCampaignOwnerStoryByCampaignDTO from '../../Application/CampaignOwnerStory/GetCampaignOwnerStoryByCampaignDTO';
import FindCampaignOwnerStoryDTO from '../../Application/CampaignOwnerStory/FindCampaignOwnerStoryDTO';
import UpdateCampaignOwnerStoryDTO from '../../Application/CampaignOwnerStory/UpdateCampaignOwnerStoryDTO';
import RemoveCampaignOwnerStoryDTO from '../../Application/CampaignOwnerStory/RemoveCampaignOwnerStoryDTO';
import { injectable, inject } from 'inversify';
import {
  ICampaignOwnerStoryService,
  ICampaignOwnerStoryServiceId,
} from '@application/CampaignOwnerStory/ICampaignOwnerStoryService';
/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */
@injectable()
class CampaignOwnerStoryController {
  constructor(
    @inject(ICampaignOwnerStoryServiceId)
    private campaignOwnerStoryService: ICampaignOwnerStoryService,
  ) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createCampaignOwnerStory = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const { title, description } = httpRequest.body;
    const createCampaignOwnerStoryDTO = new CreateCampaignOwnerStoryDTO(
      title,
      description,
      httpRequest.file ? httpRequest.file.path : '',
      campaignId,
    );
    await this.campaignOwnerStoryService.createCampaignOwnerStory(
      createCampaignOwnerStoryDTO,
    );

    return {
      body: {
        status: 'success',
        message: 'Campaign OwnerStory Created Successfully',
      },
      statusCode: 201,
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getCampaignOwnerStory = async (httpRequest) => {
    const { page, perPage, showTrashed, campaignStage, investorId } = httpRequest.query;
    const getCampaignOwnerStoryDTO = new GetCampaignOwnerStoryDTO(
      page,
      perPage,
      showTrashed,
      campaignStage,
      investorId,
    );
    const campaignOwnerStory = await this.campaignOwnerStoryService.getCampaignOwnerStories(
      getCampaignOwnerStoryDTO,
    );

    return {
      body: campaignOwnerStory,
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getOwnerStoryByCampaign = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const { page, perPage, showTrashed } = httpRequest.query;
    const getCampaignOwnerStoryDTO = new GetCampaignOwnerStoryByCampaignDTO(
      page,
      perPage,
      showTrashed,
      campaignId,
    );
    const campaignOwnerStory = await this.campaignOwnerStoryService.getOwnerStoriesByCampaign(
      getCampaignOwnerStoryDTO,
    );

    return {
      body: campaignOwnerStory,
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findCampaignOwnerStory = async (httpRequest) => {
    const { campaignOwnerStoryId } = httpRequest.params;
    const findCampaignOwnerStoryDTO = new FindCampaignOwnerStoryDTO(campaignOwnerStoryId);
    const campaignOwnerStory = await this.campaignOwnerStoryService.findCampaignOwnerStory(
      findCampaignOwnerStoryDTO,
    );

    return {
      body: { status: 'success', data: campaignOwnerStory },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updateCampaignOwnerStory = async (httpRequest) => {
    const { campaignId, campaignOwnerStoryId } = httpRequest.params;
    const { body } = httpRequest;
    const updateCampaignOwnerStoryDTO = new UpdateCampaignOwnerStoryDTO({
      campaignId,
      campaignOwnerStoryId,
      mediaUri: httpRequest.file ? httpRequest.file.path : body.mediaUri,
      ...body,
    });
    await this.campaignOwnerStoryService.updateCampaignOwnerStory(
      updateCampaignOwnerStoryDTO,
    );

    return {
      body: {
        status: 'success',
        message: 'Campaign OwnerStory Updated Successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeCampaignOwnerStory = async (httpRequest) => {
    const { campaignOwnerStoryId } = httpRequest.params;
    const { hardDelete } = httpRequest.query;
    const removeCampaignOwnerStoryDTO = new RemoveCampaignOwnerStoryDTO(
      campaignOwnerStoryId,
      hardDelete,
    );
    await this.campaignOwnerStoryService.removeCampaignOwnerStory(
      removeCampaignOwnerStoryDTO,
    );

    return {
      body: {
        status: 'success',
        message: 'Campaign OwnerStory Deleted Successfully',
      },
    };
  };
}

export default CampaignOwnerStoryController;
