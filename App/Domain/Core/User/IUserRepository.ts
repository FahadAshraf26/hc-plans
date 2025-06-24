import User from '@domain/Core/User/User';
import PaginationData from '@domain/Utils/PaginationData';
import PaginationOptions from '@domain/Utils/PaginationOptions';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const IUserRepositoryId = Symbol.for('IUserRepository');

export interface Options {
  showTrashed: any;
  query: string;
  owner: object;
  ownerQuery: string;
}

export interface ssnOptions {
  ssn: string;
  firstName: string;
  lastName: string;
}

export interface UserWithKycOptions {
  days: any;
  bankConnected: boolean;
  invested: boolean;
}

export interface IUserRepository extends IBaseRepository {
  add(user: User): Promise<boolean>;

  fetchByEmail(email: string, showTrashed: boolean): Promise<User>;
  fetchByIdWithPassword(userId: string): Promise<User>;

  fetchAllUsers(
    paginationOptions: PaginationOptions,
    options: Options,
  ): Promise<PaginationData<User>>;

  fetchAllEmailsAndNotificationToken(): Promise<Array<User>>;

  fetchUsersWithNoInvestments(
    daysSinceSignedUp: number,
    kycPassed: boolean,
  ): Promise<Array<User>>;

  fetchUserWithkyc(
    userId: string,
    paginationOptions: PaginationOptions,
    showTrashed: boolean,
  ): Promise<PaginationData<User>>;

  fetchById(userId: string, showTrashed?: boolean): Promise<User>;

  fetchByNCPartyId(NcPartyId: string, showTrashed: boolean): Promise<User>;

  activateUser(user: User): Promise<boolean>;

  fetchWithNotificationToken(options?: {}): Promise<Array<User>>;

  fetchByInvestorIds(investorIds: any): Promise<Array<User>>;

  fetchByInvestorId(investorId: string): Promise<User>;

  update(user: User): Promise<boolean>;

  remove(user: User, hardDelete: boolean): Promise<boolean>;

  fetchByDwollaId(dwollaCustomerId: string, showTrashed?: boolean): Promise<User>;

  fetchByNCAccountId(ncAccountId: string, showTrashed: boolean): Promise<User>;

  fetchByHash(hash: string, showTrashed?: boolean): Promise<User>;

  fetchUserInfoById(userId: string, showTrashed: boolean): Promise<User>;

  ssnExist({ ssn, firstName, lastName }: ssnOptions);

  fetchUsersWithAppleEmails(): Promise<Array<User>>;

  fetchUsersEmailByCategory(
    usersType: string,
    startDate: Date | null,
    endDate: Date | null,
  ): Promise<any>;

  getSummary(date: Date | null, endDate: Date | null);

  fetchUserWithKycPassedAndCriteria({
    days,
    bankConnected,
    invested,
  }: UserWithKycOptions): Promise<Array<User>>;

  updateUserPassword({ userId, password }): Promise<boolean>;
  updateIntermediary(user: string, isIntermediary: boolean): Promise<boolean>;
  updateUserEmailOrPassword(
    userId: string,
    email: string,
    password: string,
    isEmailVerified: string,
  ): Promise<any>;
  updateFcmToken(userId: string, fcmToken: string): Promise<any>;
  updateBiometricInfo(
    userId: string,
    isBiometricEnabledToken: boolean,
    biometricKey,
  ): Promise<any>;
  updateUserLastPrompt(userId, lastPrompt): Promise<boolean>;
  fetchUsersForExport(): Promise<any>;
  exportEducationalData(startDate: Date, endDate: Date): Promise<any>;
  fetchUserForInstagram(userName: string): Promise<any>;
  getAllUsersInvestments(): Promise<any>;
}
