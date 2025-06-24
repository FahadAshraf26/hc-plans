import LogUncaughtAppExceptionDTO from '../../Application/UncaughtException/LogUncaughtAppExceptionDTO';
import GetUncaughtExceptionsDTO from '../../Application/UncaughtException/GetUncaughtExceptionsDTO';
import { inject, injectable } from 'inversify';
import {
  IUncaughtExceptionService,
  IUncaughtExceptionServiceId,
} from '@application/UncaughtException/IUncaughtExceptionService';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */
@injectable()
class UncaughtExceptionController {
  constructor(
    @inject(IUncaughtExceptionServiceId)
    private uncaughtEceptionService: IUncaughtExceptionService,
  ) {}

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  logUncaughtAppEception = async (httpRequest) => {
    const input = new LogUncaughtAppExceptionDTO(httpRequest);
    await this.uncaughtEceptionService.logAppException(input);

    return {
      body: {
        status: 'success',
        message: 'exception logged successfully!',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getUncaughtExceptions = async (httpRequest) => {
    const { page, perPage, query } = httpRequest.query;
    const input = new GetUncaughtExceptionsDTO(page, perPage, query);
    const result = await this.uncaughtEceptionService.getUncaughtExceptions(input);

    return { body: result };
  };
}

export default UncaughtExceptionController;
