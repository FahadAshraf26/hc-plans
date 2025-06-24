import { IHoneycombDwollaCustomerRepository } from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import logger from '@infrastructure/Logger/logger';
import { DwollaVerificationStatus } from '@domain/Core/ValueObjects/DwollaVerificationStatus';
import MailService from '@infrastructure/Service/MailService';
import EmailTemplates from '@domain/Utils/EmailTemplates';
import { IUserRepository } from '@domain/Core/User/IUserRepository';
import { IDwollaService } from '@infrastructure/Service/IDwollaService';

const { SendHtmlEmail } = MailService;
const { userRetryTemplate } = EmailTemplates;

class CustomerVerificationNeededHandler {
  private event: any;
  private userRepository: IUserRepository;
  private dwollaService: IDwollaService;
  private honeycombDwollCustomerRepository: IHoneycombDwollaCustomerRepository;

  constructor(
    event: any,
    userRepository: IUserRepository,
    dwollaService: IDwollaService,
    honeycombDwollCustomerRepository: IHoneycombDwollaCustomerRepository,
  ) {
    this.event = event;
    this.userRepository = userRepository;
    this.dwollaService = dwollaService;
    this.honeycombDwollCustomerRepository = honeycombDwollCustomerRepository;
  }

  async execute() {
    try {
      const customerId = this.event.getResourceId();

      const dwollaCustomer = await this.honeycombDwollCustomerRepository.fetchByDwollaCustomerId(
        customerId,
      );

      const user = await this.userRepository.fetchById(dwollaCustomer.userId);

      if (!user) {
        return false;
      }
      const { status } = await this.dwollaService.getCustomer(customerId);

      if (
        user.investor.dwollaVerificationStatus !== status &&
        status === DwollaVerificationStatus.RETRY_VERFICATION
      ) {
        user.investor.setDwollaVerificationStatus(status);
        await this.userRepository.update(user);
      }
      await SendHtmlEmail(
        user.email,
        'Attention Required',
        userRetryTemplate.replace('{@USERNAME}', user.firstName || user.email),
      );

      return true;
    } catch (error) {
      logger.error(error);

      return false;
    }
  }
}

export default CustomerVerificationNeededHandler;
