import CreateCampaignNotesDTO from '@application/CampaignNotes/CreateCampaignNotesDTO';
import GetCampaignNotesDTO from '@application/CampaignNotes/GetCampaignNotesDTO';
import FindCampaignNotesDTO from '@application/CampaignNotes/FindCampaignNotesDTO';
import UpdateCampaignNotesDTO from '@application/CampaignNotes/UpdateCampaignNotesDTO';
import RemoveCampaignNotesDTO from '@application/CampaignNotes/RemoveCampaignNotesDTO';
import { inject, injectable } from 'inversify';
import {
  ICampaignNotesService,
  ICampaignNotesServiceId,
} from '@application/CampaignNotes/ICampaignNotesService';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */

@injectable()
class CampaignNotesController {
  constructor(
    @inject(ICampaignNotesServiceId) private campaignNotesService: ICampaignNotesService,
  ) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createCampaignNotes = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const { notes } = httpRequest.body;
    const createCampaignNotesDTO = new CreateCampaignNotesDTO(campaignId, notes);
    await this.campaignNotesService.createCampaignNotes(createCampaignNotesDTO);

    return {
      body: {
        status: 'success',
        message: 'Campaign Notes Created Successfully',
      },
      statusCode: 201,
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getCampaignNotes = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const { page, perPage, showTrashed } = httpRequest.query;
    const getCampaignNotesDTO = new GetCampaignNotesDTO(
      campaignId,
      page,
      perPage,
      showTrashed,
    );
    const campaignNotes = await this.campaignNotesService.getCampaignNotes(
      getCampaignNotesDTO,
    );

    return {
      body: campaignNotes,
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findCampaignNotes = async (httpRequest) => {
    const { campaignNotesId } = httpRequest.params;
    const findCampaignNotesDTO = new FindCampaignNotesDTO(campaignNotesId);
    const campaignNotes = await this.campaignNotesService.findCampaignNotes(
      findCampaignNotesDTO,
    );

    return {
      body: { status: 'success', data: campaignNotes },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updateCampaignNotes = async (httpRequest) => {
    const { campaignId, campaignNotesId } = httpRequest.params;
    const { body } = httpRequest;
    const updateCampaignNotesDTO = new UpdateCampaignNotesDTO({
      campaignId,
      campaignNotesId,
      ...body,
    });
    await this.campaignNotesService.updateCampaignNotes(updateCampaignNotesDTO);

    return {
      body: {
        status: 'success',
        message: 'Campaign Notes Updated Successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeCampaignNotes = async (httpRequest) => {
    const { campaignNotesId } = httpRequest.params;
    const { hardDelete } = httpRequest.query;
    const removeCampaignNotesDTO = new RemoveCampaignNotesDTO(
      campaignNotesId,
      hardDelete,
    );
    await this.campaignNotesService.removeCampaignNotes(removeCampaignNotesDTO);

    return {
      body: {
        status: 'success',
        message: 'Campaign Notes Deleted Successfully',
      },
    };
  };
}

export default CampaignNotesController;
