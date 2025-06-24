import {
  ISlackServiceId,
  ISlackService,
} from '@infrastructure/Service/Slack/ISlackService';
import GoogleLoginDTO from './GoogleLoginDTO';
import axios from 'axios';
import HttpException from '@infrastructure/Errors/HttpException';
import { inject, injectable } from 'inversify';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import AuthInfrastructureService from '@infrastructure/Service/Auth/AuthService';
import {
  IRedisAuthService,
  IRedisAuthServiceId,
} from '@infrastructure/Service/RedisAuth/IRedisAuthService';
import { IUserEventDao, IUserEventDaoId } from '@domain/Core/UserEvent/IUserEventDao';
import UserEvent from '@domain/Core/UserEvent/UserEvent';
import { UserEventTypes } from '@domain/Core/ValueObjects/UserEventTypes';
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
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';

const GOOGLE_INFO_URL = 'https://www.googleapis.com/oauth2/v1/userinfo';
const { slackConfig } = config;

@injectable()
class GoogleLoginUseCase {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
    private authInfrastructureService: AuthInfrastructureService,
    @inject(IRedisAuthServiceId) private redisAuthService: IRedisAuthService,
    @inject(IUserEventDaoId) private userEventDao: IUserEventDao,
    @inject(ISlackServiceId) private slackService: ISlackService,
    @inject(ICreateUSAEPayAccountId) private createUSAEPayAccount: ICreateUSAEPayAccount,
    @inject(ICreateStripeAccountId) private createStripeAccount: ICreateStripeAccount,
  ) {}
  async execute(googleLoginDTO: GoogleLoginDTO) {
    const signupTypes = ['facebook', 'instagram', 'email', 'apple'];
    const {
      data: { email },
    } = await axios.get(
      `${GOOGLE_INFO_URL}?alt=json&access_token=${googleLoginDTO.getAuthToken()}`,
    );

    if (!email) {
      throw new HttpException(401, "Can't get email from Google.");
    }

    const user = await this.userRepository.fetchByEmail(email, true);
    if (!user) {
      await this.slackService.publishMessage({
        message: `${email} signup using Google account`,
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

    await this.userEventDao.add(
      UserEvent.createFromDetail(user.userId, UserEventTypes.USER_LOGGED_IN),
    );

    await this.slackService.publishMessage({
      message: `${user.email} logged in to the system using Google account`,
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

    if (user.investor) {
      const numberOfPromotionCreditsInvestments = await this.campaignFundRepository.countPromotionCreditsInvesments(
        user.investor.investorId,
      );
      user.availedPromotionCredits = numberOfPromotionCreditsInvestments > 0;
    }

    return { user, token, refreshToken, emailAvailable: false };
  }
}

export default GoogleLoginUseCase;
