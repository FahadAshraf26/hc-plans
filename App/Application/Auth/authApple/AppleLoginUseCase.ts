import AppleLoginDTO from './AppleLoginDTO';
import HttpException from '@infrastructure/Errors/HttpException';
import { inject, injectable } from 'inversify';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import * as jwt from 'jsonwebtoken';
import AuthInfrastructureService from '@infrastructure/Service/Auth/AuthService';
import {
  IRedisAuthService,
  IRedisAuthServiceId,
} from '@infrastructure/Service/RedisAuth/IRedisAuthService';
import config from '@infrastructure/Config';
import {
  ICreateStripeAccount,
  ICreateStripeAccountId,
} from '@application/User/doKycCheck/Utils/ICreateStripeAccount';
import {
  ICreateUSAEPayAccount,
  ICreateUSAEPayAccountId,
} from '@application/User/doKycCheck/Utils/ICreateUSAEPayAccount';
import { KycStatus } from '@domain/Core/ValueObjects/KycStatus';
import {
  ISlackServiceId,
  ISlackService,
} from '@infrastructure/Service/Slack/ISlackService';
const { slackConfig } = config;

@injectable()
class AppleLoginUseCase {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    private authInfrastructureService: AuthInfrastructureService,
    @inject(IRedisAuthServiceId) private redisAuthService: IRedisAuthService,
    @inject(ISlackServiceId) private slackService: ISlackService,
    @inject(ICreateUSAEPayAccountId) private createUSAEPayAccount: ICreateUSAEPayAccount,
    @inject(ICreateStripeAccountId) private createStripeAccount: ICreateStripeAccount,
  ) {}
  async execute(appleLoginDTO: AppleLoginDTO) {
    const signupTypes = ['google', 'instagram', 'email', 'facebook'];
    // @ts-ignore
    const { email } = jwt.decode(appleLoginDTO.getAuthToken());

    if (!email) {
      throw new HttpException(401, "Can't get email from Apple.");
    }

    const user = await this.userRepository.fetchByEmail(email, true);
    if (!user) {
      await this.slackService.publishMessage({
        message: `${email} signup using Apple account`,
        slackChannelId: slackConfig.USER_ACTIVITY.ID,
      });
      return {
        emailAvailable: true,
        email,
      };
    }

    if (signupTypes.includes(user.signUpType)) {
      throw new HttpException(
        400,
        'The email entered is already being used or is not valid.',
      );
    }

    if (user && user.deletedAt) {
      const activationToken = await this.authInfrastructureService.reactivateUserToken(
        user.userId,
        5 * 60,
      );

      return {
        activationToken,
        isDeleted: true,
        message: 'user is deactivated',
      };
    }

    const token = this.redisAuthService.signJWT(user);
    const refreshToken = this.redisAuthService.createRefreshToken();
    user.setAccessToken(token, refreshToken);

    await this.redisAuthService.saveAuthenticatedUser(user);
    await this.slackService.publishMessage({
      message: `${user.email} logged in to the system using Apple account`,
      slackChannelId: slackConfig.USER_ACTIVITY.ID,
    });

    if (user.isVerified === KycStatus.PASS) {
      if (!user.vcCustomerId) {
        await this.createUSAEPayAccount.createFirstCitizenBankCustomer(user);
      }
      if (!user.vcThreadBankCustomerId) {
        await this.createUSAEPayAccount.createThreadBankCustomer(user);
      }
      if (!user.stripeCustomerId) {
        await this.createStripeAccount.createCustomer(user);
      }
    }
    return { user, token, refreshToken, emailAvailable: false };
  }
}

export default AppleLoginUseCase;
