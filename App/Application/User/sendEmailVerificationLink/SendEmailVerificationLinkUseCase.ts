import emailTemplates from '@domain/Utils/EmailTemplates';
const { emailVerificationTemplate } = emailTemplates;
import { IAuthService, IAuthServiceId } from '@infrastructure/Service/Auth/IAuthService';
import { inject, injectable } from 'inversify';
import config from '@infrastructure/Config';
import HttpError from '@infrastructure/Errors/HttpException';
import mailService from '@infrastructure/Service/MailService';
import { ISendEmailVerificationLinkUseCase } from './ISendEmailVerificationLinkUseCase';
const { SendHtmlEmail } = mailService;

const { emailConfig } = config;

@injectable()
class SendEmailVerificationLinkUseCase implements ISendEmailVerificationLinkUseCase {
  constructor(@inject(IAuthServiceId) private authService: IAuthService) {}

  async execute({ user }) {
    if (user.isUserEmailVerified()) {
      // old exception message: user's email already verified
      throw new HttpError(400, 'This email is already verified');
    }

    const emailToken = await this.authService.emailVerificationToken(
      user.userId,
      emailConfig.emailVerificationLinkExpiration,
      user.email,
    );

    const html = emailVerificationTemplate.replace(
      '{@EMAIL_LINK}',
      `${emailConfig.EMAIL_VERIFICATION_URL}?token=${emailToken}`,
    );

    await SendHtmlEmail(user.email, 'Verify Your Email', html);

    return true;
  }
}

export default SendEmailVerificationLinkUseCase;
