import InstagramLoginDTO from './InstagramLoginDTO';
import { inject, injectable } from 'inversify';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import AuthInfrastructureService from '@infrastructure/Service/Auth/AuthService';
import {
  IRedisAuthService,
  IRedisAuthServiceId,
} from '@infrastructure/Service/RedisAuth/IRedisAuthService';
import {
  ICreateStripeAccount,
  ICreateStripeAccountId,
} from '@application/User/doKycCheck/Utils/ICreateStripeAccount';
import {
  ICreateUSAEPayAccount,
  ICreateUSAEPayAccountId,
} from '@application/User/doKycCheck/Utils/ICreateUSAEPayAccount';
import { KycStatus } from '@domain/Core/ValueObjects/KycStatus';

@injectable()
class InstagramLoginUseCase {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    private authInfrastructureService: AuthInfrastructureService,
    @inject(IRedisAuthServiceId) private redisAuthService: IRedisAuthService,
    @inject(ICreateUSAEPayAccountId) private createUSAEPayAccount: ICreateUSAEPayAccount,
    @inject(ICreateStripeAccountId) private createStripeAccount: ICreateStripeAccount,
  ) {}

  async execute(instagramLoginDTO: InstagramLoginDTO) {
    const user = await this.userRepository.fetchUserForInstagram(
      instagramLoginDTO.getUserName(),
    );

    if (!user) {
      return {
        email: false,
      };
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
    const email = user.Email() ? true : false;
    await this.redisAuthService.saveAuthenticatedUser(user);

    if (user.isVerified === KycStatus.PASS) {
      if (!user.vcCustomerId) {
        await this.createUSAEPayAccount.createFirstCitizenBankCustomer(user);
        await this.createUSAEPayAccount.createThreadBankCustomer(user);
      }
      if (!user.stripeCustomerId) {
        await this.createStripeAccount.createCustomer(user);
      }
    }
    return { user, token, refreshToken, email };
  }
}

export default InstagramLoginUseCase;
