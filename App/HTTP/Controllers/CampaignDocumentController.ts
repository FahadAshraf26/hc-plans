import {
  ICampaignNPAUseCase,
  ICampaignNPAUseCaseId,
} from '@application/CampaignDocument/CampaignNPA/ICampaignNPAUseCase';
import GetCampaignDocumentsDTO from '@application/CampaignDocument/GetCampaignDocumentsDTO';
import FindCampaignDocumentDTO from '@application/CampaignDocument/FindCampaignDocumentDTO';
import UpdateCampaignDocumentDTO from '@application/CampaignDocument/UpdateCampaignDocumentDTO';
import RemoveCampaignDocumentDTO from '@application/CampaignDocument/RemoveCampaignDocumentDTO';
import CreateCampaignDocumentDTO from '@application/CampaignDocument/CreateCampaignDocumentDTO';
import { inject, injectable } from 'inversify';
import {
  ICampaignDocumentService,
  ICampaignDocumentServiceId,
} from '@application/CampaignDocument/ICampaignDocumentService';
import GetCampaignNPADTO from '@application/CampaignDocument/CampaignNPA/GetCampaignNPADTO';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */

@injectable()
class CampaignDocumentController {
  constructor(
    @inject(ICampaignDocumentServiceId)
    private campaignDocumentService: ICampaignDocumentService,
    @inject(ICampaignNPAUseCaseId)
    private campaignNPAUseCase: ICampaignNPAUseCase,
  ) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getCampaignDocuments = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const { page, perPage, showTrashed, q } = httpRequest.query;

    const input = new GetCampaignDocumentsDTO(campaignId, page, perPage, showTrashed, q);
    const campaignDocuments = await this.campaignDocumentService.getCampaignDocuments(
      input,
    );

    return { body: campaignDocuments };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findCampaignDocument = async (httpRequest) => {
    const { campaignDocumentId } = httpRequest.params;

    const input = new FindCampaignDocumentDTO(campaignDocumentId);
    const campaignDocument = await this.campaignDocumentService.findCampaignDocument(
      input,
    );

    return {
      body: {
        status: 'success',
        data: campaignDocument,
      },
    };
  };
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updateCampaignDocument = async (httpRequest) => {
    const { campaignId, campaignDocumentId } = httpRequest.params;
    const { body } = httpRequest;

    const input = new UpdateCampaignDocumentDTO({
      ...body,
      ...httpRequest.file,
      campaignId,
      campaignDocumentId,
    });
    await this.campaignDocumentService.updateCampaignDocument(input);

    return {
      body: {
        status: 'success',
        message: 'campaign document updated successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeCampaignDocument = async (httpRequest) => {
    const { campaignDocumentId } = httpRequest.params;
    const { hardDelete = false } = httpRequest.query;

    const input = new RemoveCampaignDocumentDTO(campaignDocumentId, hardDelete);
    await this.campaignDocumentService.removeCampaignDocument(input);

    return {
      body: {
        status: 'success',
        message: 'campaign document deleted successfully',
      },
    };
  };
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createCampaignDocument = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const { documentType, name, ext } = httpRequest.body;
    let path, mimeType;

    if (httpRequest.files && httpRequest.files.length > 0) {
      path = httpRequest.files[0].path;
      mimeType = httpRequest.files[0].mimetype;
    } else {
      path = httpRequest.body.documentUrl;
      mimeType = 'web/url';
    }

    const input = new CreateCampaignDocumentDTO(
      campaignId,
      documentType,
      name,
      path,
      mimeType,
      ext,
    );

    await this.campaignDocumentService.createCampaignDocument(input);

    return {
      body: {
        status: 'success',
        message: 'campaign document created successfully',
      },
    };
  };

  getCampaignNPA = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const { investmentType } = httpRequest.query;
    const input = new GetCampaignNPADTO(campaignId,investmentType);
    const campaignNPA = await this.campaignNPAUseCase.execute(input);
    return {
      body: {
        status: 'success',
        data: campaignNPA,
      },
    };
  };
}

export default CampaignDocumentController;
