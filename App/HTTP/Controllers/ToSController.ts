import CreateToSDTO from '../../Application/ToS/CreateToSDTO';
import GetAllToSDTO from '../../Application/ToS/GetAllToSDTO';
import FindToSDTO from '../../Application/ToS/FindToSDTO';
import UpdateToSDTO from '../../Application/ToS/UpdateToSDTO';
import RemoveToSDTO from '../../Application/ToS/RemoveToSDTO';
import GetUserTosDTO from '../../Application/ToS/getUserToS/GetUserTosDTO';
import { inject, injectable } from 'inversify';
import { IToSService, IToSServiceId } from '@application/ToS/IToSService';
import {
  IGetUserToSUseCase,
  IGetUserToSUseCaseId,
} from '@application/ToS/getUserToS/IGetUserToSUseCase';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */

@injectable()
class ToSController {
  constructor(
    @inject(IToSServiceId) private tosService: IToSService,
    @inject(IGetUserToSUseCaseId) private getUserTosUseCase: IGetUserToSUseCase,
  ) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createToS = async (httpRequest) => {
    const {
      termOfServicesUpdateDate,
      privacyPolicyUpdateDate,
      educationalMaterialUpdateDate,
      faqsUpdateDate,
    } = httpRequest.body;

    const createToSDTO = new CreateToSDTO(
      termOfServicesUpdateDate,
      privacyPolicyUpdateDate,
      educationalMaterialUpdateDate,
      faqsUpdateDate,
    );

    await this.tosService.createToS(createToSDTO);

    return { body: { status: 'success', message: 'ToS Created Successfully' } };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getAllToS = async (httpRequest) => {
    const { page, perPage, showTrashed } = httpRequest.query;

    const getAllToSDTO = new GetAllToSDTO(page, perPage, showTrashed);
    const tos = await this.tosService.getAllToS(getAllToSDTO);
    return { body: tos };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findToS = async (httpRequest) => {
    const { tosId } = httpRequest.params;

    const findToSDTO = new FindToSDTO(tosId);
    const tos = await this.tosService.findToS(findToSDTO);

    return {
      body: {
        status: 'success',
        data: tos,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updateToS = async (httpRequest) => {
    const { body } = httpRequest;
    const { tosId } = httpRequest.params;

    const updateToSDTO = new UpdateToSDTO({ ...body, tosId });
    await this.tosService.updateToS(updateToSDTO);

    return {
      body: {
        status: 'success',
        message: 'ToS updated successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeToS = async (httpRequest) => {
    const { tosId } = httpRequest.params;
    const { hardDelete } = httpRequest.query;

    const removeToSDTO = new RemoveToSDTO(tosId, hardDelete);
    await this.tosService.removeToS(removeToSDTO);

    return {
      body: {
        status: 'success',
        message: 'ToS Deleted Successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getUserTos = async (httpRequest) => {
    const { userId } = httpRequest.params;

    const input = new GetUserTosDTO(userId);
    const result = await this.getUserTosUseCase.execute(input);
    return {
      body: {
        status: 'success',
        data: result,
      },
    };
  };
}

export default ToSController;
