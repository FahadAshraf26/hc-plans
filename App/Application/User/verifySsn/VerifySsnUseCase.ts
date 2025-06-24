import HttpError from '../../../Infrastructure/Errors/HttpException';
import { inject, injectable } from 'inversify';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import { IVerifySsnUseCase } from '@application/User/verifySsn/IVerifySsnUseCase';
import { IUserEventDao, IUserEventDaoId } from '@domain/Core/UserEvent/IUserEventDao';
import { UserEventTypes } from '@domain/Core/ValueObjects/UserEventTypes';
import UserEvent from '@domain/Core/UserEvent/UserEvent';
import PaginationOptions from '@domain/Utils/PaginationOptions';
import {
  IRedisAuthService,
  IRedisAuthServiceId,
} from '@infrastructure/Service/RedisAuth/IRedisAuthService';

@injectable()
class VerifySsnUseCase implements IVerifySsnUseCase {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IUserEventDaoId) private userEventDao: IUserEventDao,
    @inject(IRedisAuthServiceId) private redisAuthService: IRedisAuthService,
  ) {}

  async execute({ userId, ssn }) {
    const paginationOptions = new PaginationOptions(1, 100);
    const user = await this.userRepository.fetchById(userId, false);
    const userEvent = await this.userEventDao.fetchAllByUserId(userId, paginationOptions);
    const ssnEvent = userEvent.items.filter(
      (item) => item.type === UserEventTypes.SSN_VERIFICATION_FAILED,
    );

    if (!user) {
      return true;
    }

    if (user.deletedAt) {
      throw new HttpError(
        403,
        'This account was recently deleted. Please email support@honeycombcredit.com to reactivate this account.',
      );
    }

    const lastFourSsn = user.ssn.slice(user.ssn.length - 4);
    if (lastFourSsn === ssn.toString() && ssnEvent.length < 1) {
      await this.userEventDao.add(
        UserEvent.createFromDetail(user.userId, UserEventTypes.SSN_VERIFIED),
      );
      user.isSsnVerified = true;
      user.shouldVerifySsn = false;
      await this.userRepository.update(user);
      const token = this.redisAuthService.signJWT(user);
      const refreshToken = this.redisAuthService.createRefreshToken();
      user.setAccessToken(token, refreshToken);

      await this.redisAuthService.saveAuthenticatedUser(user);
      return { user, token, refreshToken };
    } else {
      if (ssnEvent.length > 1) {
        throw new HttpError(
          400,
          'Temporarily on hold. You attempted to verify ssn number multiple times, that you are failed to do so we are putting your account on hold. Please contact support@honeycombcredit.com.',
        );
      } else {
        await this.userEventDao.add(
          UserEvent.createFromDetail(user.userId, UserEventTypes.SSN_VERIFICATION_FAILED),
        );
        throw new HttpError(
          400,
          'SSN Verification failed. Please try again and correct input your last four digits of SSN.',
        );
      }
    }
  }
}

export default VerifySsnUseCase;
