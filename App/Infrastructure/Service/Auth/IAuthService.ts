export const IAuthServiceId = Symbol.for('IAuthService');

export interface IAuthService {
  hashPassword(password: string): Promise<string>;
  verifyPassword(password: string, encryptedPassword: string): Promise<boolean>;
  authToken(userId: string, expiresIn: number): Promise<string>;
  adminAuthToken(adminUserId: string, expiresIn: number): Promise<string>;
  forgetPasswordToken(userId: string, expiresIn: number): Promise<string>;
  emailVerificationToken(
    userId: string,
    expiresIn: number,
    emailId: string,
  ): Promise<string>;
  reactivateUserToken(userId: string, expiresIn: number): Promise<string>;
  verifyToken(token: string): Promise<any>;
  setPasswordToken(userId: string, expiresIn: string | number): Promise<string>;
}
