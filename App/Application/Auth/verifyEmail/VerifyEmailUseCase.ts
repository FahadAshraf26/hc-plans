import VerifyEmailDTO from './VerifyEmailDTO';
import { TokenType } from '../../../Domain/Core/ValueObjects/TokenType';
import { inject, injectable } from 'inversify';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import { IUserEventDao, IUserEventDaoId } from '@domain/Core/UserEvent/IUserEventDao';
import { EmailVerificationStatus } from '@domain/Core/ValueObjects/EmailVerificationStatus';
import UserEvent from '@domain/Core/UserEvent/UserEvent';
import { UserEventTypes } from '@domain/Core/ValueObjects/UserEventTypes';
import config from '@infrastructure/Config';
import mailService from '@infrastructure/Service/MailService';
import HttpException from '@infrastructure/Errors/HttpException';
import emailTemplates from '@domain/Utils/EmailTemplates';
const {
  emailVerificationCompleteTemplate,
  aboutMiventureTemplate,
  SomethingWentWrongTemplate,
  emailAlreadyVerifiedTemplate,
  emailVerificationLinkExpiredTemplate,
  OldEmailUpdatedTemplate,
} = emailTemplates;
import AuthInfrastructureService from '../../../Infrastructure/Service/Auth/AuthService';
const { emailConfig, server } = config;
const { SendHtmlEmail } = mailService;

@injectable()
class VerifyEmailUseCase {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IUserEventDaoId) private userEventDao: IUserEventDao,
    private authInfrastructureService: AuthInfrastructureService,
  ) {}
  async execute(verifyEmailDTO: VerifyEmailDTO) {
    try {
      if (!verifyEmailDTO.getToken()) {
        return SomethingWentWrongTemplate;
      }

      const decoded = await this.authInfrastructureService.verifyToken(
        verifyEmailDTO.getToken(),
      );

      if (!decoded.type || decoded.type !== TokenType.EMAIL_VERIFICATION) {
        return SomethingWentWrongTemplate;
      }

      const user = await this.userRepository.fetchById(decoded.userId);
      if (!user) {
        return SomethingWentWrongTemplate;
      }
      if (decoded.emailId && decoded.emailId !== user.email) {
        return OldEmailUpdatedTemplate;
      }
      if (user.isEmailVerified === EmailVerificationStatus.VERIFIED) {
        return emailAlreadyVerifiedTemplate;
      }

      user.setEmailVerificationStatus(EmailVerificationStatus.VERIFIED);

      await Promise.all([
        this.userRepository.update(user),
        this.userEventDao.add(
          UserEvent.createFromDetail(user.userId, UserEventTypes.EMAIL_VERIFIED),
        ),
      ]);
      const loginLink = server.IS_PRODUCTION
        ? 'https://invest.honeycombcredit.com/login'
        : 'https://application.honeycombcredit.com/login';
        const verifyLink = server.IS_PRODUCTION
        ? 'https://invest.honeycombcredit.com/verify-email'
        : 'https://application.honeycombcredit.com/verify-email';
      const html = aboutMiventureTemplate
        .replace('{@USERNAME}', user.firstName || user.email)
        .replace('{@EMAIL_LINK}', `${emailConfig.MIVENTURE_SUPPORT_EMAIL}`)
        .replace('{@EDUCATION_MATERIAL_LINK}', emailConfig.EDUCATIONAL_MATERIAL_LINK);
      await SendHtmlEmail(
        user.email,
        'Thanks for creating a Honeycomb Credit account!',
        html,
      );
      const template = emailVerificationCompleteTemplate
        .replace('{@LOGIN_LINK}', loginLink)
        .replace('{@VERIFY_LINK}', verifyLink)
        .replace('{@VERIFY_LINK_1}', verifyLink)
      return template;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      if (err.message === 'jwt expired') {
        return emailVerificationLinkExpiredTemplate;
      }

      throw err;
    }
  }
}

export default VerifyEmailUseCase;
