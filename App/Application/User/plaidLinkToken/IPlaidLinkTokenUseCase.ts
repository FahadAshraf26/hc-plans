import { UseCase } from '@application/BaseInterface/UseCase';
import PlaidLinkTokenDTO from '@application/User/plaidLinkToken/PlaidLinkTokenDTO';
import plaid from 'plaid';

export const IPlaidLinkTokenUseCaseId = Symbol.for('IPlaidLinkTokenUseCase');

export interface IPlaidLinkTokenUseCase
  extends UseCase<PlaidLinkTokenDTO, plaid.LinkTokenCreateResponse> {
  updateModeToken(
    userId: string,
    investorId: string,
    redirect_uri?: string,
    android_package_name?: string,
  ): Promise<plaid.LinkTokenCreateResponse>;
}
