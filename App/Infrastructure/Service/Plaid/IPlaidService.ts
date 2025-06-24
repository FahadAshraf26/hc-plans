import plaid from 'plaid';

export const IPlaidServiceId = Symbol.for('IPlaidService');

export interface IPlaidService {
  getAccessToken(publicToken: string): Promise<string>;
  getStripeToken(accountId: string, accessToken: string): Promise<string>;
  getDwollaToken(accountId: string, accessToken: string): Promise<string>;
  getAccounts(accessToken: string): Promise<plaid.AuthGetResponse>;
  createPlaidLinkToken(userId: string, redirect_uri?: string, android_package_name?: string): Promise<plaid.LinkTokenCreateResponse>;
  createUpdateModeToken(
    userId: string,
    accessToken: string,
    redirect_uri?: string,
    android_package_name?: string,
  ): Promise<plaid.LinkTokenCreateResponse>;
  balanceCheck(accessToken: string): Promise<plaid.AccountsGetResponse>
  /** Initialize Plaid Link for Identity Verification */
  createIdentityVerificationLinkToken(
    userId: string,
    userEmail: string
  ): Promise<plaid.LinkTokenCreateResponse>;

  /** Create a new KYC session */
  createIdentityVerification(
    user: any,
    userId: string,
  ): Promise<plaid.IdentityVerificationCreateResponse>;

  /** Fetch status/details of a KYC session */
  getIdentityVerification(
    verificationId: string
  ): Promise<plaid.IdentityVerificationGetResponse>;

  /** List all KYC sessions for a user */
  listIdentityVerifications(
    clientUserId: string
  ): Promise<plaid.IdentityVerificationListResponse>;

  /** Retry a KYC session (e.g. reset or resume) */
  retryIdentityVerification(
    verificationId: string,
    strategy?: 'reset' | 'incomplete'
  ): Promise<plaid.IdentityVerificationRetryResponse>;

}
