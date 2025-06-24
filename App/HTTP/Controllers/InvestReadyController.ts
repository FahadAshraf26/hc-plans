import { IUserService, IUserServiceId } from '@application/User/IUserService';
import { inject, injectable } from 'inversify';

import UserService from '../../Application/User/UserService';
import HandleInvestReadyRedirectDTO from '@application/User/HandleInvestReadyRedirectDTO';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */
@injectable()
class InvestReadyController {
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  constructor(@inject(IUserServiceId) private userService: IUserService) {}
  handleAuthRedirect = async (httpRequest) => {
    const { code } = httpRequest.query;
    const input = new HandleInvestReadyRedirectDTO(code);
    // const html = await UserService.handleInvestReadyRedirect(input);

    return {
      body: 'InvestReadyController',
      headers: {
        'Content-Type': 'text/html',
      },
    };
  };
}

export default InvestReadyController;
