export const IInvestReadyServiceId = Symbol.for('IInvestReadyService');
export interface IInvestReadyService {
  getUserToken(AuthorizationCode): Promise<any>;
  refreshUserToken(refreshToken): Promise<any>;
  getUser(accessToken): Promise<any>;
  refreshTokenAndGetUser(refreshToken: string): Promise<any>;
}
