import FacebookLoginDTO from './FacebookLoginDTO';
import axios from 'axios';
import HttpException from '@infrastructure/Errors/HttpException';
import { inject, injectable } from 'inversify';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import AuthInfrastructureService from '@infrastructure/Service/Auth/AuthService';
import {
  IRedisAuthService,
  IRedisAuthServiceId,
} from '@infrastructure/Service/RedisAuth/IRedisAuthService';
import {
  ISlackService,
  ISlackServiceId,
} from '@infrastructure/Service/Slack/ISlackService';
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
const { slackConfig } = config;

const FACEBOOK_INFO_URL = 'https://graph.facebook.com';

@injectable()
class FacebookLoginUseCase {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    private authInfrastructureService: AuthInfrastructureService,
    @inject(IRedisAuthServiceId) private redisAuthService: IRedisAuthService,
    @inject(ISlackServiceId) private slackService: ISlackService,
    @inject(ICreateUSAEPayAccountId) private createUSAEPayAccount: ICreateUSAEPayAccount,
    @inject(ICreateStripeAccountId) private createStripeAccount: ICreateStripeAccount,
  ) {}

  async execute(facebookLoginDTO: FacebookLoginDTO) {
    const signupTypes = ['google', 'instagram', 'email', 'apple'];
    const {
      data: { email },
    } = await axios.get(
      `${FACEBOOK_INFO_URL}/me?fields=email&access_token=${facebookLoginDTO.getAuthToken()}`,
    );

    if (!email) {
      throw new HttpException(401, "Can't get email from Facebook!");
    }

    const user = await this.userRepository.fetchByEmail(email, true);

    if (!user) {
      await this.slackService.publishMessage({
        message: `${email} signup using Facebook account`,
        slackChannelId: slackConfig.USER_ACTIVITY.ID,
      });
      return {
        emailAvailable: true,
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
      message: `${user.email} logged in to the system using Facebook account`,
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

export default FacebookLoginUseCase;
