import { inject, injectable } from 'inversify';
import PlaidLinkTokenDTO from '@application/User/plaidLinkToken/PlaidLinkTokenDTO';
import {
  IPlaidLinkTokenUseCase,
  IPlaidLinkTokenUseCaseId,
} from '@application/User/plaidLinkToken/IPlaidLinkTokenUseCase';
import {
  IPlaidService,
  IPlaidServiceId,
} from '@infrastructure/Service/Plaid/IPlaidService';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */
@injectable()
class PlaidController {
  constructor(
    @inject(IPlaidLinkTokenUseCaseId)
    private plaidLinkTokenUseCase: IPlaidLinkTokenUseCase,
    @inject(IPlaidServiceId) private plaidService: IPlaidService,
  ) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getPlaidLinkToken = async (httpRequest) => {
    const { userId, investorId } = httpRequest.decoded;
    const { isUpdateMode, redirect_uri, android_package_name } = httpRequest.query;

    const dto = new PlaidLinkTokenDTO(userId, investorId, isUpdateMode, redirect_uri, android_package_name);
    return {
      body: { status: 'success', data: await this.plaidLinkTokenUseCase.execute(dto) },
    };
  };

  getIssuerPlaidLinkToken = async (httpRequest) => {
    const { issuerId } = httpRequest.params;
    return {
      body: {
        status: 'success',
        data: await this.plaidService.createPlaidLinkToken(issuerId),
      },
    };
  };

  getIdentityVerificationLinkToken = async (httpRequest) => {
    const { userId , email} = httpRequest.decoded;
    const linkTokenResponse = await this.plaidService.createIdentityVerificationLinkToken(
      String(userId),
      email
    );
    return {
      body: { status: 'success', data: linkTokenResponse },
    };
  };

  getIdentityVerification = async (httpRequest) => {
    const { verificationId } = httpRequest.params;
    const iv = await this.plaidService.getIdentityVerification(verificationId);
    return {
      body:
      {
        status: "success",
        data: iv
      }
    };
  }

  getIdentityVerificationAttempts = async (httpRequest) => {
    const { userId } = httpRequest.query;
    const idvAttempts = await this.plaidService.listIdentityVerifications(
      String(userId)
    );
    return {
      body: { status:'success', data: idvAttempts }
    }
  }
}

export default PlaidController;
