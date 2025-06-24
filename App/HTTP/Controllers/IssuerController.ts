import GetAllIssuersDTO from '@application/Issuer/GetAllIssuersDTO';
import GetAllIssuersByOwnerDTO from '@application/Issuer/GetAllIssuersByOwnerDTO';
import GetOneIssuerDTO from '@application/Issuer/GetOneIssuerDTO';
import UpdateIssuerDTO from '@application/Issuer/UpdateIssuerDTO';
import DeleteIssuerDTO from '@application/Issuer/DeleteIssuerDTO';
import CreateIssuerDTO from '@application/Issuer//createIssuer/CreateIssuerDTO';
import GetIssuerInfoDTO from '@application/Issuer/GetIssuerInfoDTO';
import { inject, injectable } from 'inversify';
import { IIssuerService, IIssuerServiceId } from '@application/Issuer/IIssuerService';
import {
  ICreateIssuerUseCase,
  ICreateIssuerUseCaseId,
} from '@application/Issuer/createIssuer/ICreateIssuerUseCase';
import RetryBusinessDwollaDTO from '@application/Issuer/RetryDwollaBusinessDTO';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */

@injectable()
class IssuerController {
  constructor(
    @inject(IIssuerServiceId) private issuerService: IIssuerService,
    @inject(ICreateIssuerUseCaseId) private createIssuerUseCase: ICreateIssuerUseCase,
  ) {}

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getAllIssuers = async (httpRequest) => {
    const {
      page,
      perPage,
      showTrashed,
      q,
    }: { page: number; perPage: number; showTrashed: string; q: any } = httpRequest.query;

    const input = new GetAllIssuersDTO(page, perPage, showTrashed, q);
    const issuers = await this.issuerService.getAllIssuers(input);

    return { body: issuers };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getAllIssuersByOwner = async (httpRequest) => {
    const { ownerId } = httpRequest.params;
    const { page, perPage, showTrashed } = httpRequest.query;

    const input = new GetAllIssuersByOwnerDTO(ownerId, page, perPage, showTrashed);
    const issuers = await this.issuerService.getAllIssuersByOwner(input);

    return { body: issuers };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findIssuer = async (httpRequest) => {
    const { issuerId } = httpRequest.params;

    const input = new GetOneIssuerDTO(issuerId);
    const issuer = await this.issuerService.findIssuer(input);

    return {
      body: {
        status: 'success',
        data: issuer,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updateIssuer = async (httpRequest) => {
    const { body } = httpRequest;
    const { issuerId } = httpRequest.params;
    const input = new UpdateIssuerDTO({ ...body, issuerId });

    await this.issuerService.updateIssuer(input);
    return {
      body: {
        status: 'success',
        message: 'Issuer updated successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeIssuer = async (httpRequest) => {
    const { issuerId } = httpRequest.params;
    const { hardDelete = false } = httpRequest.query;

    const input = new DeleteIssuerDTO(issuerId, hardDelete);
    await this.issuerService.removeIssuer(input);

    return { body: { status: 'success', message: 'issuer deleted successfully' } };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createIssuer = async (httpRequest) => {
    const { ownerIds, ip, ...issuerProps } = httpRequest.body;
    const clientIp = ip || httpRequest.clientIp;

    const dto = new CreateIssuerDTO(issuerProps, ownerIds, clientIp);
    await this.createIssuerUseCase.execute(dto);

    return { body: { status: 'success', message: 'issuer created successfully' } };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */

  GetIssuerInfo = async (httpRequest) => {
    const { issuerId } = httpRequest.params;

    const input = new GetIssuerInfoDTO(issuerId);
    const issuer = await this.issuerService.getIssuerInfo(input);

    return {
      body: {
        status: 'success',
        data: issuer,
      },
    };
  };

  retryDwollaBusiness = async (httpRequest) => {
    const { customerId } = httpRequest.params;

    const input = new RetryBusinessDwollaDTO(customerId);
    const response = await this.issuerService.retryDwollaBusiness(input);
    return {
      body: response,
    };
  };

  updateCustomer = async (httpRequest) => {
    const { customerId } = httpRequest.params;
    const data = await this.issuerService.updateDwollaCustomer(customerId);
    return {
      body: {
        status: 'success',
        data,
      },
    };
  };

  updateBusinessCustomer = async (httpRequest) => {
    const { customerId } = httpRequest.params;

    const data = await this.issuerService.updateDwollaBusinessCustomer(
      customerId,
      httpRequest.body,
    );
    return {
      body: {
        status: 'success',
        data,
      },
    };
  };

  updateBusinessCustomerDwollaBalanceId = async (httpRequest) => {
    const { customerId } = httpRequest.params;
    const { dwollaBalanceId } = httpRequest.body;
    await this.issuerService.updateBusinessCustomerDwollaBalanceId(
      customerId,
      dwollaBalanceId,
    );
    return {
      body: {
        status: 'success',
        data: 'Dwolla funding source id updated successfully',
      },
    };
  };

  getDwollaBeneficialOwner = async (httpRequest) => {
    const { dwollaCustomerId } = httpRequest.params;

    const data = await this.issuerService.getDwollaBeneficialOwner(dwollaCustomerId);
    return {
      body: {
        status: 'success',
        data,
      },
    };
  };
}

export default IssuerController;
