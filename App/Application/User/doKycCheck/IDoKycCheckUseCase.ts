import User from '@domain/Core/User/User';

export const IDoKycCheckUseCaseId = Symbol.for('IDokycCHeckUseCase');

export interface IDokycCHeckUseCase {
  fetchUser(userId: string): Promise<User>;

  existingCheckResponse(
    currentStatus,
  ): { isVerified: boolean; underManualReview: boolean; isEmailSent: boolean };

  isPendingVerificationLinkExpired(user: User): Promise<boolean>;

  verifyExistingCheck(user: User): Promise<any>;

  CheckIfFailedKYCThresholdMet(userId: string);

  sendPendingCheckEmail(user: User, response): Promise<any>;

  initiateKycCheck(
    user: User,
    ip,
  ): Promise<{ isVerified: boolean; underManualReview: boolean; isEmailSent: boolean }>;

  sendSlackNotification(user: User, kycStatus);

  execute({
    userId,
    forceKyc,
    isAdminRequest,
    ip,
  }: {
    userId: string;
    forceKyc: boolean;
    isAdminRequest: boolean;
    ip;
  }): Promise<{ isVerified: boolean; underManualReview: boolean; isEmailSent: boolean }>;
}
