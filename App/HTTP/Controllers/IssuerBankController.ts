import AddIssuerBankDTO from '@application/IssuerBank/AddIssuerBankDTO';
import GetIssuerBanksDTO from '@application/IssuerBank/getIssuerBanksDTO';
import removeIssuerBankDTO from '@application/IssuerBank/RemoveIssuerBankDTO';
import { inject, injectable } from 'inversify';
import {
  IIssuerBankService,
  IIssuerBankServiceId,
} from '@application/IssuerBank/IIssuerBankService';
import AddIssuerBankWithAuthorizationDTO from '@application/IssuerBank/AddIssuerBankWithAuthorizationDTO';
import UpdateIssuerBankDTO from '@application/IssuerBank/UpdateIssuerBankDTO';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */
@injectable()
class IssuerBankController {
  constructor(
    @inject(IIssuerBankServiceId) private issuerBankService: IIssuerBankService,
  ) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  addBank = async (httpRequest) => {
    const { publicToken, accountId, accountType, accountOwner } = httpRequest.body;
    const { issuerId } = httpRequest.params;

    const input = new AddIssuerBankDTO(
      publicToken,
      accountId,
      issuerId,
      accountType,
      accountOwner,
    );
    await this.issuerBankService.addBank(input);

    return {
      body: {
        status: 'success',
        message: 'account added successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getBanks = async (httpRequest) => {
    const { issuerId } = httpRequest.params;
    const { page, perPage, showTrashed, includeWallet = false } = httpRequest.query;

    const input = new GetIssuerBanksDTO(
      issuerId,
      page,
      perPage,
      showTrashed,
      includeWallet,
    );
    const result = await this.issuerBankService.getBanks(input);

    return { body: result };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeBank = async (httpRequest) => {
    const { issuerId, issuerBankId } = httpRequest.params;

    const input = new removeIssuerBankDTO(issuerId, issuerBankId);
    await this.issuerBankService.removeBank(input);

    return {
      body: {
        status: 'success',
        message: 'issuer bank deleted successfully',
      },
    };
  };

  addBankWithAuthorization = async (httpRequest) => {
    const { issuerId } = httpRequest.params;
    const {
      accountName,
      accountNumber,
      accountType,
      routingNumber,
      accountOwner,
    } = httpRequest.body;
    const input = new AddIssuerBankWithAuthorizationDTO(
      issuerId,
      accountNumber,
      accountName,
      routingNumber,
      accountType,
      accountOwner,
    );

    await this.issuerBankService.addIssuerBankWithAuthorization(input);
    return {
      body: {
        status: 'success',
        message: 'issuer bank added successfully',
      },
    };
  };

  updateBank = async (httpRequest) => {
    const { body } = httpRequest;
    const { issuerId, issuerBankId } = httpRequest.params;
    const input = new UpdateIssuerBankDTO(issuerBankId, body, issuerId);
    await this.issuerBankService.updateBank(input);
    return {
      body: {
        status: 'success',
        message: 'issuer bank updated successfully',
      },
    };
  };
}

export default IssuerBankController;
