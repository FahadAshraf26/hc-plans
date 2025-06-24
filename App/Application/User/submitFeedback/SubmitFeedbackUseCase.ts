import { ISubmitFeedbackUseCase } from './ISubmitFeedbackUseCase';

import emailTemplates from '../../../Domain/Utils/EmailTemplates';
import config from '../../../Infrastructure/Config';
import { injectable } from 'inversify';
import mailService from '@infrastructure/Service/MailService';
const { feedbackTemplate } = emailTemplates;
const { emailConfig } = config;
const { SendHtmlEmail } = mailService;

@injectable()
class SubmitFeedbackUseCase implements ISubmitFeedbackUseCase {
  async execute({ email, text }) {
    const html = feedbackTemplate.replace('{@EMAIL}', email).replace('{@FEEDBACK}', text);

    await SendHtmlEmail(emailConfig.HONEYCOMB_EMAIL, 'Feedback Received', html);

    return true;
  }
}

export default SubmitFeedbackUseCase;
