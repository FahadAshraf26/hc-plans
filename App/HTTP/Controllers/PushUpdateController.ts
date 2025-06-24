import CreateNewUpdateDTO from '@application/PushUpdate/CreateNewUpdateDTO';
import PushUpdateService from '@application/PushUpdate/PushUpdateService';
import { inject, injectable } from 'inversify';
import {
  IPushUpdateService,
  IPushUpdateServiceId,
} from '@application/PushUpdate/IPushUpdateService';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */

@injectable()
class PushUpdateController {
  constructor(
    @inject(IPushUpdateServiceId) private pushUpdateService: IPushUpdateService,
  ) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  pushUpdate = async (httpRequest) => {
    const { version, action, description } = httpRequest.body;
    const input = new CreateNewUpdateDTO(version, action, description);
    await this.pushUpdateService.addNewRelease(input);
    return {
      body: {
        status: 'success',
        message: 'New released pushed successfully',
      },
    };
  };

  /**
   * It will return latest release
   * @returns {Promise<HttpResponse>}
   */
  fetchLatestRelease = async () => {
    const latestRelease = await this.pushUpdateService.getLatestRelease();
    return {
      body: {
        status: 'success',
        data: latestRelease,
      },
    };
  };
}

export default PushUpdateController;
