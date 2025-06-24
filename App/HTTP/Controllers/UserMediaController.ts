import CreateUserMediaDTO from '@application/UserMedia/CreateUserMediaDTO';
import GetUserMediaDTO from '@application/UserMedia/GetUserMediaDTO';
import FindUserMediaDTO from '@application/UserMedia/FindUserMediaDTO';
import DeleteUserMediaDTO from '@application/UserMedia/DeleteUserMediaDTO';
import { inject, injectable } from 'inversify';
import {
  IUserMediaService,
  IUserMediaServiceId,
} from '@application/UserMedia/IUserMediaService';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */
@injectable()
class UserMediaController {
  constructor(@inject(IUserMediaServiceId) private userMediaService: IUserMediaService) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createUserMedia = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const { name, type } = httpRequest.body;

    const { path, mimetype: mimeType, originalPath } = httpRequest.file;

    const input = new CreateUserMediaDTO(
      userId,
      name,
      type,
      originalPath,
      mimeType,
      path,
    );
    await this.userMediaService.createUserMedia(input);

    return {
      body: {
        status: 'success',
        message: 'user media created successfully!',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getUserMedia = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const { page, perPage, showTrashed, query } = httpRequest.query;

    const input = new GetUserMediaDTO(userId, page, perPage, query, showTrashed);
    const result = await this.userMediaService.getUserMedia(input);

    return {
      body: {
        status: 'success',
        data: result,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findUserMedia = async (httpRequest) => {
    const { userMediaId } = httpRequest.params;

    const input = new FindUserMediaDTO(userMediaId);
    const userMedia = await this.userMediaService.findUserMedia(input);

    return {
      body: {
        status: 'success',
        data: userMedia,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  deleteUserMedia = async (httpRequest) => {
    const { userMediaId } = httpRequest.params;

    const input = new DeleteUserMediaDTO(userMediaId);
    await this.userMediaService.deleteUserMedia(input);

    return {
      body: {
        status: 'success',
        message: 'user media deleted successfully!',
      },
    };
  };
}

export default UserMediaController;
