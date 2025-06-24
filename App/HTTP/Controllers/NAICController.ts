import CreateNAICDTO from '@application/NAIC/CreateNAICDTO';
import FindNAICDTO from '@application/NAIC/FindNAICDTO';
import GetNAICDTO from '@application/NAIC/GetNAICDTO';
import UpdateNAICDTO from '@application/NAIC/UpdateNAICDTO';
import RemoveNAICDTO from '@application/NAIC/RemoveNAICDTO';
import { inject, injectable } from 'inversify';
import { INAICService, INAICServiceId } from '@application/NAIC/INAICService';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */

@injectable()
class NAICController {
  constructor(@inject(INAICServiceId) private naicService: INAICService) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createNAIC = async (httpRequest) => {
    const { code, title } = httpRequest.body;
    const input = new CreateNAICDTO(code, title);
    await this.naicService.createNAIC(input);

    return {
      body: {
        status: 'success',
        message: 'naic created successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findNAIC = async (httpRequest) => {
    const { naicId } = httpRequest.params;

    const input = new FindNAICDTO(naicId);
    const naic = await this.naicService.findNAIC(input);

    return {
      body: {
        status: 'success',
        data: naic,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updateNAIC = async (httpRequest) => {
    const { naicId } = httpRequest.params;
    const { body } = httpRequest;
    const input = new UpdateNAICDTO({ ...body, naicId });
    await this.naicService.updateNAIC(input);

    return {
      body: {
        status: 'success',
        message: 'naic updated successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeNAIC = async (httpRequest) => {
    const { naicId } = httpRequest.params;

    const input = new RemoveNAICDTO(naicId);
    await this.naicService.removeNAIC(input);

    return {
      body: {
        status: 'success',
        message: 'naic deleted successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getNAIC = async (httpRequest) => {
    const { page, perPage, q } = httpRequest.query;
    const input = new GetNAICDTO(page, perPage, q);
    const naics = await this.naicService.getNAIC(input);
    return { body: naics };
  };
}

export default NAICController;
