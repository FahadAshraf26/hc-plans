import User from '@domain/Core/User/User';

export const IRedisAuthServiceId = Symbol.for('IRedisAuthService');
export interface IRedisAuthService {
  refreshTokenExists(refreshToken: string): Promise<any>;
  getUserIdFromRefreshToken(refreshToken: string): Promise<any>;
  saveAuthenticatedUser(user: User): Promise<void>;
  deAuthenticateUser(userId: string): Promise<any>;
  saveForgotPasswordToken(user: User, forgotPasswordToken: string): Promise<void>;
  createRefreshToken(): any;
  signJWT(props: any, expiryTime?: any): any;
  decodeJWT(token: string): any;
  constructKey(userId: string, refreshToken: string): any;
  constructForgotPasswordTokenKey(userId: string): any;
  addToken(
    userId: string,
    refreshToken: string,
    token: string,
    expiry: number,
  ): Promise<boolean>;
  addForgotPasswordToken(userId: string, token: string, expiry: number): Promise<boolean>;
  clearAllTokens(): Promise<any>;
  countSessions(userId: string): any;
  countTokens(): any;
  getTokens(userId: string): Promise<any>;
  getForgotPasswordTokens(userId: string): Promise<any>;
  getToken(userId: string, refreshToken: string): Promise<any>;
  clearToken(userId: string, refreshToken: string): Promise<any>;
  clearAllSessions(userId: string): Promise<any>;
  clearPasswordResetTokens(userId: string): Promise<any>;
  sessionExists(userId: string, refreshToken: string): Promise<any>;
  hash: string;
  forgotPasswordHash: string;
}
