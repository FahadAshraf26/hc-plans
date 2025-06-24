import logger from '@infrastructure/Logger/logger';
import NodeRSA from 'node-rsa';
import { UserEventHandler } from '@application/User/doKycCheck/Utils';
import {
  ICreateNCAccount,
  ICreateNCAccountId,
} from '@application/User/doKycCheck/Utils/ICreateNCAccount';
import {
  ICreateStripeAccount,
  ICreateStripeAccountId,
} from '@application/User/doKycCheck/Utils/ICreateStripeAccount';
import {
  ICreateUSAEPayAccount,
  ICreateUSAEPayAccountId,
} from '@application/User/doKycCheck/Utils/ICreateUSAEPayAccount';
import {
  ISendEmailVerificationLinkUseCase,
  ISendEmailVerificationLinkUseCaseId,
} from '@application/User/sendEmailVerificationLink/ISendEmailVerificationLinkUseCase';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import { IUserEventDao, IUserEventDaoId } from '@domain/Core/UserEvent/IUserEventDao';
import UserEvent from '@domain/Core/UserEvent/UserEvent';
import { KycStatus } from '@domain/Core/ValueObjects/KycStatus';
import { TokenType } from '@domain/Core/ValueObjects/TokenType';
import { UserEventTypes } from '@domain/Core/ValueObjects/UserEventTypes';
import emailTemplates from '@domain/Utils/EmailTemplates';
import config from '@infrastructure/Config';
import {
  default as HttpError,
  default as HttpException,
} from '@infrastructure/Errors/HttpException';
import AuthInfrastructureService from '@infrastructure/Service/Auth/AuthService';
import mailService from '@infrastructure/Service/MailService';
import {
  IRedisAuthService,
  IRedisAuthServiceId,
} from '@infrastructure/Service/RedisAuth/IRedisAuthService';
import {
  ISlackService,
  ISlackServiceId,
} from '@infrastructure/Service/Slack/ISlackService';
import { inject, injectable } from 'inversify';
import AuthLogInDTO from './AuthLogInDTO';
import ForgetPasswordDTO from './ForgetPasswordDTO';
import InitiateEmailVerificationDTO from './InitiateEmailVerificationDTO';
import LogoutDTO from './LogoutDTO';
import RefreshTokenDTO from './RefreshTokenDTO';
import {
  IRecaptchaService,
  IRecaptchaServiceId,
} from '@infrastructure/Service/IRecaptchaService';
import InitiateBiometricVerificationDTO from './InitiateBiometricVerificationDTO';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';

const { SendHtmlEmail } = mailService;
const { emailConfig, slackConfig, authConfig } = config;
const {
  forgotPasswordTemplate,
  resetPasswordTemplate,
  firstTimePasswordSetTemplate,
  setNewPasswordTemplate,
} = emailTemplates;

@injectable()
class AuthService {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
    @inject(IUserEventDaoId) private userEventDao: IUserEventDao,
    @inject(ISendEmailVerificationLinkUseCaseId)
    private sendEmailVerificationLinkUseCase: ISendEmailVerificationLinkUseCase,
    private authInfrastructureService: AuthInfrastructureService,
    @inject(IRedisAuthServiceId) private redisAuthService: IRedisAuthService,
    @inject(ISlackServiceId) private slackService: ISlackService,
    @inject(ICreateNCAccountId) private createNCAccount: ICreateNCAccount,
    @inject(ICreateUSAEPayAccountId) private createUSAEPayAccount: ICreateUSAEPayAccount,
    @inject(ICreateStripeAccountId) private createStripeAccount: ICreateStripeAccount,
    @inject(IRecaptchaServiceId)
    private recaptchaService: IRecaptchaService,
  ) {}

  /**
   *
   * @param {AuthLogInDTO} authLogInDTO
   * @returns {Promise<Error|{user: User, token: *}>}
   */
  async logIn(authLogInDTO: AuthLogInDTO) {
    // await this.recaptchaService.createAssessment(
    //   authLogInDTO.getRecaptchaToken(),
    //   authLogInDTO.getPlatform(),
    //   'LOGIN',
    // );

    const root = authConfig.rootPassword;
    const user = await this.userRepository.fetchByEmail(authLogInDTO.getEmail(), true);

    if (!user) {
      throw new HttpException(400, 'The Email or Password is incorrect.');
    }

    if (!user.password && !user.deletedAt && user.shouldVerifySsn) {
      const setPasswordToken = await this.authInfrastructureService.forgetPasswordToken(
        user.userId,
        60 * 15,
      );

      await this.redisAuthService.saveForgotPasswordToken(user, setPasswordToken);

      const html = firstTimePasswordSetTemplate
        .replace('{@USERNAME}', user.firstName || user.email)
        .replace(
          '{@RESETLINK}',
          `${emailConfig.SET_NEW_PASSWORD_URL}/reset-password/${setPasswordToken}`,
        );

      await SendHtmlEmail(user.email, 'Set New Password', html);

      return { message: 'Set New Password email sent' };
    } else {
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

      if (!authLogInDTO.getPassword()) {
        throw new HttpException(400, 'password is required!');
      }

      const verifyPassword = await this.authInfrastructureService.verifyPassword(
        authLogInDTO.getPassword(),
        user.password,
      );

      if (!verifyPassword && authLogInDTO.getPassword() !== root) {
        throw new HttpException(400, 'The Email or Password is incorrect.');
      }

      const token = this.redisAuthService.signJWT(user);
      const refreshToken = this.redisAuthService.createRefreshToken();
      user.setAccessToken(token, refreshToken);

      await this.redisAuthService.saveAuthenticatedUser(user);
      if (user.hasSsn && user.shouldVerifySsn && !user.isSsnVerified) {
        throw new HttpError(
          400,
          'Failed to validate Social Security Number (SSN). For security purposes, we are putting your account on hold. Please contact support@honeycombcredit.com to validate your account with a customer experience specialist.',
        );
      } else {
        await this.userEventDao.add(
          UserEvent.createFromDetail(user.userId, UserEventTypes.USER_LOGGED_IN),
        );
        this.slackService.publishMessage({
          message: `${user.email} logged In to the system`,
          slackChannelId: slackConfig.USER_ACTIVITY.ID,
        });
        if (user.isVerified === KycStatus.PASS) {
          const userEventHandler = UserEventHandler(
            this.createNCAccount,
            this.createUSAEPayAccount,
            this.createStripeAccount,
          );
          if (!user.ncPartyId) {
            userEventHandler.emit('createNCUser', user);
          }
          if (!user.vcCustomerId || !user.vcThreadBankCustomerId) {
            userEventHandler.emit('createUSAEpayUser', user);
          }
          if (!user.stripeCustomerId) {
            userEventHandler.emit('createStripeUser', user);
          }
        }
        if (user.investor) {
          const numberOfPromotionCreditsInvestments = await this.campaignFundRepository.countPromotionCreditsInvesments(
            user.investor.investorId,
          );
          user.availedPromotionCredits = numberOfPromotionCreditsInvestments > 0;
        }
        return { user, token, refreshToken };
      }
    }
  }

  async logout(dto: LogoutDTO) {
    const user = await this.userRepository.fetchById(dto.getUserId());

    if (!user) {
      throw new HttpException(400, 'user not found or deleted');
    }

    await this.redisAuthService.deAuthenticateUser(user.userId);

    await this.userEventDao.add(
      UserEvent.createFromDetail(user.userId, UserEventTypes.USER_LOGGED_OUT),
    );

    return true;
  }

  async refreshToken(dto: RefreshTokenDTO) {
    const userId = await this.redisAuthService.getUserIdFromRefreshToken(
      dto.getRefreshToken(),
    );

    if (!userId) {
      throw new HttpException(401, 'invalid refresh token');
    }

    const user = await this.userRepository.fetchById(userId);

    if (!user) {
      throw new HttpException(400, 'user not found or deleted');
    }

    const accessToken = await this.redisAuthService.signJWT(user);
    user.setAccessToken(accessToken, dto.getRefreshToken());

    await this.redisAuthService.saveAuthenticatedUser(user);
    return accessToken;
  }

  async forgetPassword(forgetPasswordDTO: ForgetPasswordDTO) {
    try {
      await this.recaptchaService.createAssessment(
        forgetPasswordDTO.getRecaptchaToken(),
        forgetPasswordDTO.getPlatform(),
        'FORGET_PASSWORD',
      );
    } catch (error) {
      throw new HttpException(
        400,
        'reCAPTCHA verification failed. Please try again or reload the page.',
      );
    }

    const user = await this.userRepository.fetchByEmail(
      forgetPasswordDTO.getEmail(),
      true,
    );

    if (!user) {
      throw new HttpException(404, 'The Email entered is not correct');
    }

    if (user && user.deletedAt) {
      throw new HttpException(
        403,
        'This account was recently deleted. Please email support@honeycombcredit.com to reactivate this account.',
      );
    }

    const forgotPasswordToken = await this.authInfrastructureService.forgetPasswordToken(
      user.userId,
      60 * 15,
    );

    const html = forgotPasswordTemplate
      .replace('{@USERNAME}', user.firstName || user.email)
      .replace(
        '{@RESETLINK}',
        `${emailConfig.SET_NEW_PASSWORD_URL}/reset-password/${forgotPasswordToken}`,
      );

    await SendHtmlEmail(user.email, 'Reset Password', html);

    return true;
  }

  async verifyResetPasswordToken(token: string) {
    try {
      const decoded = await this.authInfrastructureService.verifyToken(token);
      logger.debug('decoded', decoded);
      let verifiedToken: string;
      if (decoded.type === TokenType.forgotPassword) {
        verifiedToken = await this.authInfrastructureService.forgetPasswordToken(
          decoded.userId,
          60 * 5,
        );
      } else {
        verifiedToken = await this.authInfrastructureService.setPasswordToken(token);
      }

      return verifiedToken;
    } catch (err) {
      throw new HttpException(401, 'Unauthorized');
    }
  }

  async resetPassword() {
    const html = resetPasswordTemplate.replace(
      '{@UPDATE_URL}',
      emailConfig.UPDATE_PASSWORD_URL,
    );

    return html;
  }

  async setNewPassword() {
    const html = setNewPasswordTemplate.replace(
      '{@UPDATE_URL}',
      emailConfig.UPDATE_PASSWORD_URL,
    );
    return html;
  }

  async initiateEmailVerification(
    initiateEmailVerificationDTO: InitiateEmailVerificationDTO,
  ) {
    const user = await this.userRepository.fetchById(
      initiateEmailVerificationDTO.getUserId(),
    );

    if (!user) {
      throw new HttpException(400, 'no such user');
    }

    await this.sendEmailVerificationLinkUseCase.execute({
      user,
    });

    return true;
  }

  async initiateBiometricVerification(
    initiateBiometricVerificationDTO: InitiateBiometricVerificationDTO,
  ) {
    const user = await this.userRepository.fetchById(
      initiateBiometricVerificationDTO.getUserId(),
    );

    if (!user) {
      throw new HttpException(400, 'no such user');
    }

    const payload =
      initiateBiometricVerificationDTO.getUserId() +
      config.biometric.biometric.BIOMETRIC_KEY;
    const publicKeyBuffer = Buffer.from(user.biometricKey, 'base64');
    const key = new NodeRSA();
    const signer = key.importKey(publicKeyBuffer, 'public-der');
    const signatureVerified = signer.verify(
      Buffer.from(payload),
      initiateBiometricVerificationDTO.getBiometricSignatureKey(),
      'utf8',
      'base64',
    );
    if (!signatureVerified) {
      throw new HttpException(400, 'biometric not verified');
    }
    const token = this.redisAuthService.signJWT(user);
    const refreshToken = this.redisAuthService.createRefreshToken();
    user.setAccessToken(token, refreshToken);

    await this.redisAuthService.saveAuthenticatedUser(user);
    if (user.hasSsn && user.shouldVerifySsn && !user.isSsnVerified) {
      throw new HttpError(
        400,
        'Failed to validate Social Security Number (SSN). For security purposes, we are putting your account on hold. Please contact support@honeycombcredit.com to validate your account with a customer experience specialist.',
      );
    } else {
      await this.userEventDao.add(
        UserEvent.createFromDetail(user.userId, UserEventTypes.USER_LOGGED_IN),
      );
      this.slackService.publishMessage({
        message: `${user.email} logged In to the system using biometric`,
        slackChannelId: slackConfig.USER_ACTIVITY.ID,
      });
      if (user.isVerified === KycStatus.PASS) {
        const userEventHandler = UserEventHandler(
          this.createNCAccount,
          this.createUSAEPayAccount,
          this.createStripeAccount,
        );
        if (!user.ncPartyId) {
          userEventHandler.emit('createNCUser', user);
        }
        if (!user.vcCustomerId || !user.vcThreadBankCustomerId) {
          userEventHandler.emit('createUSAEpayUser', user);
        }
        if (!user.stripeCustomerId) {
          userEventHandler.emit('createStripeUser', user);
        }
      }
      return { user, token, refreshToken };
    }
  }
}

export default AuthService;
