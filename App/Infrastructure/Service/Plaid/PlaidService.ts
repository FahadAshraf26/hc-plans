import { injectable, inject } from 'inversify';
import plaid, {
  PlaidApi,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
  CountryCode,
  AccountsGetResponse,
  Strategy,
  IDNumberType,
} from 'plaid';
import { configuration, idvConfig } from '../../Config/plaid';
import { IPlaidService } from './IPlaidService';

const plaidClient = new PlaidApi(configuration);

@injectable()
class PlaidService implements IPlaidService {
  /**
   * get accessToken against a plaid account
   * @param {string} publicToken
   * @returns string - access token for that user
   */
  async getAccessToken(publicToken) {
    try {
      const response = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
      });
      return response.data.access_token;
    } catch (error) {
      throw error;
    }
  }

  /**
   * create a stripe token for that bank aaccount
   * @param {string} accountId palid account id
   * @param {string} accessToken plaid user access token
   * @returns string - stripe access token for that bank
   */
  async getStripeToken(accountId, accessToken) {
    try {
      const stripeTokenResponse = await plaidClient.processorStripeBankAccountTokenCreate(
        accessToken,
        accountId,
      );

      return stripeTokenResponse.data.stripe_bank_account_token;
    } catch (error) {
      throw error;
    }
  }

  async getDwollaToken(accountId, accessToken) {
    try {
      const processorTokenResponse = await plaidClient.processorTokenCreate({
        access_token: accessToken,
        account_id: accountId,
        processor: ProcessorTokenCreateRequestProcessorEnum.Dwolla,
      });
      return processorTokenResponse.data.processor_token;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all accounts attached to a Plaid item
   * @param {string} accessToken
   * @returns {plaid.AccountsGetResponse} result
   */
  async getAccounts(accessToken: string): Promise<any> {
    try {
      const authResponse = await plaidClient.authGet({
        access_token: accessToken,
      });
      // authResponse.data has accounts, item, and numbers.{ach, eft}
      return authResponse.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate a Link Token for initializing Plaid Link
   * @param userId - your internal ID for this user
   * @returns the raw LinkTokenCreateResponse data
   */
  async createPlaidLinkToken(
    userId: string,
    redirect_uri?: string,
    android_package_name?: string,
  ): Promise<plaid.LinkTokenCreateResponse> {
    try {
      const response = await plaidClient.linkTokenCreate({
        user: {
          client_user_id: userId,
        },
        client_name: 'Honeycomb Credit',
        products: [Products.Auth],
        country_codes: [CountryCode.Us],
        language: 'en',
        ...(redirect_uri ? { redirect_uri } : {}),
        ...(android_package_name ? { android_package_name } : {}),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param userId        – your internal ID for this user
   * @param accessToken   – the existing Plaid item access token
   * @returns the raw LinkTokenCreateResponse data
   */
  async createUpdateModeToken(
    userId: string,
    accessToken: string,
    redirect_uri?: string,
    android_package_name?: string,
  ): Promise<plaid.LinkTokenCreateResponse> {
    try {
      const response = await plaidClient.linkTokenCreate({
        user: {
          client_user_id: userId,
        },
        client_name: 'Honeycomb Credit',
        country_codes: [CountryCode.Us],
        language: 'en',
        access_token: accessToken,
        ...(redirect_uri ? { redirect_uri } : {}),
        ...(android_package_name ? { android_package_name } : {}),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async balanceCheck(accessToken: string): Promise<AccountsGetResponse> {
    try {
      const response = await plaidClient.accountsBalanceGet({
        access_token: accessToken,
      });
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async createIdentityVerificationLinkToken(
    userId: string,
    userEmail: string,
  ): Promise<plaid.LinkTokenCreateResponse> {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: userId, email_address: userEmail },
      client_name: 'Honeycomb Credit',
      country_codes: [CountryCode.Us],
      language: 'en',
      products: [Products.IdentityVerification],
      identity_verification: { template_id: idvConfig.templateId },
    });
    return response.data;
  }

  /**
   * @param user        – the user object
   * @param gaveConsent – whether the user gave consent
   * @returns the raw IdentityVerificationCreateResponse data
   */
  async createIdentityVerification(user: any, userId:string): Promise<any> {
   try {
      user.id_number.type = IDNumberType.UsSsn;
      const response = await plaidClient.identityVerificationCreate({
        client_user_id: userId,
        template_id: idvConfig.templateId,
        gave_consent: true,
        is_shareable: true,
        is_idempotent: true,
        user: user
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getIdentityVerification(
    verificationId: string,
  ): Promise<plaid.IdentityVerificationGetResponse> {
    try {
      const response = await plaidClient.identityVerificationGet({
        identity_verification_id: verificationId,
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  async listIdentityVerifications(
    clientUserId: string,
  ): Promise<plaid.IdentityVerificationListResponse> {
    const response = await plaidClient.identityVerificationList({
      client_user_id: clientUserId,
      template_id: idvConfig.templateId,
    });
    return response.data;
  }

  async retryIdentityVerification(
    clientUserId: string,
  ): Promise<plaid.IdentityVerificationRetryResponse> {
    const response = await plaidClient.identityVerificationRetry({
      client_user_id: clientUserId,
      template_id: idvConfig.templateId,
      strategy: Strategy.Reset,
    });
    return response.data;
  }
}

export default PlaidService;
