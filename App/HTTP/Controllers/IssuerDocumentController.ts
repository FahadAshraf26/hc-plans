import IssuerDocumentService from '@application/IssuerDocument/IssuerDocumentService';
import GetIssuerDocumentsDTO from '@application/IssuerDocument/GetIssuerDocumentsDTO';
import FindIssuerDocumentDTO from '@application/IssuerDocument/FindIssuerDocumentDTO';
import UpdateIssuerDocumentDTO from '@application/IssuerDocument/UpdateIssuerDocumentDTO';
import RemoveIssuerDocumentDTO from '@application/IssuerDocument/RemoveIssuerDocumentDTO';
import CreateIssuerDocumentDTO from '@application/IssuerDocument/CreateIssuerDocumentDTO';
import { inject, injectable } from 'inversify';
import { IIssuerDocumentServiceId } from '@application/IssuerDocument/IIssuerDocumentService';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */

@injectable()
class IssuerDocumentController {
  constructor(
    @inject(IIssuerDocumentServiceId)
    private issuerDocumentService: IssuerDocumentService,
  ) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getIssuerDocuments = async (httpRequest) => {
    const { issuerId } = httpRequest.params;
    const { page, perPage, showTrashed, q } = httpRequest.query;

    const input = new GetIssuerDocumentsDTO(issuerId, page, perPage, showTrashed, q);
    const issuerDocuments = await this.issuerDocumentService.getIssuerDocuments(input);

    return { body: issuerDocuments };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findIssuerDocument = async (httpRequest) => {
    const { issuerDocumentId } = httpRequest.params;

    const input = new FindIssuerDocumentDTO(issuerDocumentId);
    const issuerDocument = await this.issuerDocumentService.findIssuerDocument(input);

    return {
      body: {
        status: 'success',
        data: issuerDocument,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updateIssuerDocument = async (httpRequest) => {
    const { issuerId, issuerDocumentId } = httpRequest.params;
    const { body } = httpRequest;

    const input = new UpdateIssuerDocumentDTO({
      ...body,
      ...httpRequest.file,
      issuerId,
      issuerDocumentId,
    });
    await this.issuerDocumentService.updateIssuerDocument(input);

    return {
      body: {
        status: 'success',
        message: 'issuer document updated successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeIssuerDocument = async (httpRequest) => {
    const { issuerDocumentId } = httpRequest.params;
    const { hardDelete = false } = httpRequest.query;

    const input = new RemoveIssuerDocumentDTO(issuerDocumentId, hardDelete);
    await this.issuerDocumentService.removeIssuerDocument(input);

    return {
      body: {
        status: 'success',
        message: 'issuer document deleted successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createIssuerDocument = async (httpRequest) => {
    const { issuerId } = httpRequest.params;
    const { documentType, name, ext } = httpRequest.body;
    const { path, mimetype: mimeType } = httpRequest.file;

    const input = new CreateIssuerDocumentDTO(
      issuerId,
      documentType,
      name,
      path,
      mimeType,
      ext,
    );

    await this.issuerDocumentService.createIssuerDocument(input);

    return {
      body: {
        status: 'success',
        message: 'issuer document created successfully',
      },
    };
  };
}

export default IssuerDocumentController;
