import { inject, injectable } from 'inversify';
import CreateUserAppFeedbackDTO from '../../Application/UserAppFeedback/CreateUserAppFeedbackDTO';
import GetUserAppFeedbackDTO from '../../Application/UserAppFeedback/GetUserAppFeedbackDTO';
import FindUserAppFeedbackDTO from '../../Application/UserAppFeedback/FindUserAppFeedbackDTO';
import {
  IUserAppFeedback,
  IUserAppFeedbackService,
} from '@application/UserAppFeedback/IUserAppFeedback';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */

@injectable()
class UserFeedbackAppController {
  constructor(
    @inject(IUserAppFeedbackService) private userAppFeedbackService: IUserAppFeedback,
  ) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createUserAppFeedback = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const { rating, text } = httpRequest.body;

    const input = new CreateUserAppFeedbackDTO(userId, rating, text);
    await this.userAppFeedbackService.createUserAppFeedback(input);

    return {
      body: {
        status: 'success',
        message: 'user app feedback submitted successfully!',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getUserAppFeedback = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const { page, perPage, showTrashed, q } = httpRequest.query;

    const input = new GetUserAppFeedbackDTO(userId, page, perPage, showTrashed, q);
    const result = await this.userAppFeedbackService.getUserAppFeedback(input);

    return { body: result };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findUserAppFeedback = async (httpRequest) => {
    const { userAppFeedbackId } = httpRequest.params;

    const input = new FindUserAppFeedbackDTO(userAppFeedbackId);
    const feedback = await this.userAppFeedbackService.findUserAppFeedback(input);

    return {
      body: {
        status: 'success',
        data: feedback,
      },
    };
  };
}

export default UserFeedbackAppController;
