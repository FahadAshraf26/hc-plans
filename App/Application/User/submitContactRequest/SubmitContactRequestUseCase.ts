import { injectable } from 'inversify';
import contactUsTemplate from '../../../Domain/Utils/EmailTemplates/contactUsTemplate';
import config from '../../../Infrastructure/Config';
import mailService from '@infrastructure/Service/MailService';
import { ISubmitContactRequestUseCase } from '@application/User/submitContactRequest/ISubmitContactRequestUseCase';

const { emailConfig: EmailConfig } = config;

@injectable()
class SubmitContactRequestUseCase implements ISubmitContactRequestUseCase {
  async execute({ email, text }) {
    const html = contactUsTemplate
      .replace('{@EMAIL}', email)
      .replace('{@FEEDBACK}', text);

    await mailService.SendHtmlEmail(
      EmailConfig.HONEYCOMB_EMAIL,
      'Contact Request Received',
      html,
    );

    return true;
  }
}

export default SubmitContactRequestUseCase;
