import { InvestorAccreditationStatus } from '@domain/Core/ValueObjects/InvestorAccreditationStatus';
import { UpdateAiVerificationWebhookStatus } from '@domain/Core/ValueObjects/UpdateAiVerificationWebhookStatus';
import emailTemplates from '@domain/Utils/EmailTemplates';
import config from '@infrastructure/Config';

const { notifyAdminForAccreditationTemplate } = emailTemplates;
const { emailConfig } = config;
import {
  IInvestorAccreditationDAO,
  IInvestorAccreditationDAOId,
} from '@domain/Core/InvestorAccreditation/IInvestorAccreditationDAO';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import mailService from '@infrastructure/Service/MailService';
import { inject, injectable } from 'inversify';
import { IUpdateAiVerificationWebhookHandler } from '@application/Webhooks/NorthCapital/webhookHandlers/updateAiVerificationWebhookHandler/IUpdateAiVerificationWebhookHandler';

const { SendHtmlEmail } = mailService;

@injectable()
class UpdateAiVerificationWebhookHandler implements IUpdateAiVerificationWebhookHandler {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IInvestorAccreditationDAOId)
    private investorAccreditationDAO: IInvestorAccreditationDAO,
  ) {}

  async execute(event) {
    const user = await this.userRepository.fetchByNCAccountId(
      event.payload().accountId,
      false,
    );

    if (!user) {
      return false;
    }

    const investorAccreditation = await this.investorAccreditationDAO.fetchByInvestorId(
      user.investor.investorId,
    );

    if (!investorAccreditation) {
      return false;
    }

    if (event.payload().accreditedStatus === UpdateAiVerificationWebhookStatus.VERIFIED) {
      investorAccreditation.result = InvestorAccreditationStatus.ACCREDITED;
    } else {
      investorAccreditation.result = InvestorAccreditationStatus.PENDING;
    }

    await this.investorAccreditationDAO.update(investorAccreditation);

    if (event.payload().aiRequestStatus === 'Need More Info') {
      const template = notifyAdminForAccreditationTemplate
        .replace('{@ADMIN_NAME}', 'Jason')
        .replace('{@FIRST_NAME}', user.firstName + ' ' + user.lastName)
        .replace('{@EMAIL}', user.email);

      await SendHtmlEmail(
        emailConfig.HONEYCOMB_EMAIL,
        'Need more info for accreditation',
        template,
      );
    }

    return true;
  }
}

export default UpdateAiVerificationWebhookHandler;
