import CapitalRequestService from '../../Application/CapitalRequest/CapitalRequestService';
import CreateCapitalRequestDTO from '../../Application/CapitalRequest/CreateCapitalRequestDTO';
import GetCapitalRequestsDTO from '../../Application/CapitalRequest/GetCapitalRequestDTO';
import { injectable } from 'inversify';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */
@injectable()
class CapitalRequestController {
  constructor(private capitalRequestService: CapitalRequestService) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createCapitalRequest = async (httpRequest) => {
    const {
      businessName,
      state,
      description,
      capitalRequired,
      capitalReason,
    } = httpRequest.body;

    const { userId } = httpRequest.decoded;

    const input = new CreateCapitalRequestDTO(
      userId,
      businessName,
      state,
      description,
      capitalRequired,
      capitalReason,
    );

    await this.capitalRequestService.createCapitalRequest(input);

    return {
      body: {
        status: 'success',
        message: 'capital request submitted successfully!',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getCapitalRequests = async (httpRequest) => {
    const { page, perPage, showTrashed } = httpRequest.query;

    const input = new GetCapitalRequestsDTO(page, perPage, showTrashed);
    const capitalRequests = await this.capitalRequestService.getCapitalRequests(input);

    return { body: capitalRequests };
  };
}

export default CapitalRequestController;
