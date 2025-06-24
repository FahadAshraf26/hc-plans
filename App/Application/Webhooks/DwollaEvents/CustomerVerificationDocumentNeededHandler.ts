import logger from '@infrastructure/Logger/logger';
import { DwollaVerificationStatus } from '@domain/Core/ValueObjects/DwollaVerificationStatus';
import MailService from '@infrastructure/Service/MailService';
import EmailTemplates from '@domain/Utils/EmailTemplates';
import { IUserRepository } from '@domain/Core/User/IUserRepository';
import { IDwollaService } from '@infrastructure/Service/IDwollaService';

const { SendHtmlEmail } = MailService;
const { userDocumentNeededTemplate } = EmailTemplates;

class CustomerVerificationDocumentNeededHandler {
  private event: any;
  private userRepository: IUserRepository;
  private dwollaService: IDwollaService;
  constructor(
    event: any,
    userRepository: IUserRepository,
    dwollaService: IDwollaService,
  ) {
    this.event = event;
    this.userRepository = userRepository;
    this.dwollaService = dwollaService;
  }

  async execute() {
    try {
      const customerId = this.event.getResourceId();

      const user = await this.userRepository.fetchByDwollaId(customerId);

      if (!user) {
        return false;
      }
      const { status } = await this.dwollaService.getCustomer(customerId);

      if (
        user.investor.dwollaVerificationStatus !== status &&
        status === DwollaVerificationStatus.DOCUMENT_NEEDED
      ) {
        user.investor.setDwollaVerificationStatus(status);
        await this.userRepository.update(user);
      }

      await SendHtmlEmail(
        user.email,
        'Id Verification Required',
        userDocumentNeededTemplate.replace('{@FIRST_NAME}', user.firstName),
      );

      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }
}

export default CustomerVerificationDocumentNeededHandler;
