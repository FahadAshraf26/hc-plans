import { inject, injectable } from 'inversify';
import {
  IUserDocumentService,
  IUserDocumentServiceId,
} from '@application/UserDocument/IUserDocumentService';
import GetUserDocumentsDTO from '@application/UserDocument/GetUserDocumentsDTO';
import FindUserDocumentDTO from '@application/UserDocument/FindUserDocumentDTO';
import UpdateUserDocumentDTO from '@application/UserDocument/UpdateUserDocumentDTO';
import RemoveUserDocumentDTO from '@application/UserDocument/RemoveUserDocumentDTO';
import CreateUserDocumentDTO from '@application/UserDocument/CreateUserDocumentDTO';
import CreateMultipleUserDocumentDTO from '@application/UserDocument/CreateMutlipleUserDocumentDTO';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */
@injectable()
class UserDocumentController {
  constructor(
    @inject(IUserDocumentServiceId) private userDocumentService: IUserDocumentService,
  ) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getUserDocuments = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const { page, perPage, showTrashed, q,requestOrigin } = httpRequest.query;

    const input = new GetUserDocumentsDTO(userId, page, perPage, showTrashed, q);
    input.setIsAdminRequest(requestOrigin);
    const userDocuments = await this.userDocumentService.getUserDocuments(input);

    return { body: userDocuments };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findUserDocument = async (httpRequest) => {
    const { userDocumentId } = httpRequest.params;

    const input = new FindUserDocumentDTO(userDocumentId);
    const userDocument = await this.userDocumentService.findUserDocument(input);

    return {
      body: {
        status: 'success',
        data: userDocument,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updateUserDocument = async (httpRequest) => {
    const { userId, userDocumentId } = httpRequest.params;
    const { body } = httpRequest;

    const input = new UpdateUserDocumentDTO({
      ...body,
      ...httpRequest.file,
      userId,
      userDocumentId,
    });
    await this.userDocumentService.updateUserDocument(input);

    return {
      body: {
        status: 'success',
        message: 'user document updated successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeUserDocument = async (httpRequest) => {
    const { userDocumentId } = httpRequest.params;
    const { hardDelete = false } = httpRequest.query;

    const input = new RemoveUserDocumentDTO(userDocumentId, hardDelete);
    await this.userDocumentService.removeUserDocument(input);

    return {
      body: {
        status: 'success',
        message: 'user document deleted successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createUserDocument = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const { documentType, name } = httpRequest.body;

    const input = new CreateMultipleUserDocumentDTO(
      userId,
      documentType,
      name,
      httpRequest.files,
    );

    const response = await this.userDocumentService.createMultipleUserDocument(input);

    return {
      body: {
        status: response.status,
        message: response.message,
      },
    };
  };

  getCloudSignedDocumentUrl = async (httpRequest) => {
    const { fileName } = httpRequest.query;
    const response = await this.userDocumentService.getCloudSignedDocumentUrl(fileName);

    return {
      body: {
        status: 'success',
        data: response,
      },
    };
  };
}

export default UserDocumentController;
