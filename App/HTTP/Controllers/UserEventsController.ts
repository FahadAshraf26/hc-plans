import { inject, injectable } from 'inversify';
import GetUserEventDTO from '../../Application/UserEvents/GetUserEventDTO';
import {
  IUserEventService,
  IUserEventServiceId,
} from '@application/UserEvents/IUserEventService';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */
@injectable()
class UserEventsController {
  /**
   *
   * @param {UserEventService} userEventService
   */
  constructor(@inject(IUserEventServiceId) private userEventService: IUserEventService) {}

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  get = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const { eventName } = httpRequest.query;
    const input = new GetUserEventDTO(userId, eventName);
    const event = await this.userEventService.get(input);

    return {
      body: {
        status: 'success',
        data: event,
      },
    };
  };
}

export default UserEventsController;
