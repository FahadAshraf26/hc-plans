import logger from '@infrastructure/Logger/logger';
import { IssuerStatus } from '@domain/Core/ValueObjects/IssuerStatus';
import { DwollaVerificationStatus } from '@domain/Core/ValueObjects/DwollaVerificationStatus';
import DwollaCustomerDTO from './DwollaCustomerDTO';
import MailService from '@infrastructure/Service/MailService';
import EmailTemplates from '@domain/Utils/EmailTemplates';
import { IUserRepository } from '@domain/Core/User/IUserRepository';
import { IIssuerRepository } from '@domain/Core/Issuer/IIssuerRepository';
import { IDwollaService } from '@infrastructure/Service/IDwollaService';

const { SendHtmlEmail, BakeEmail } = MailService;
const { userSuspendedTemplate } = EmailTemplates;

class CustomerSuspendedHandler {
  private event: any;
  private userRepository: IUserRepository;
  private issuerRepository: IIssuerRepository;
  private dwollaService: IDwollaService;

  constructor(
    event: any,
    userRepository: IUserRepository,
    issuerRepository: IIssuerRepository,
    dwollaService: IDwollaService,
  ) {
    this.event = event;
    this.userRepository = userRepository;
    this.issuerRepository = issuerRepository;
    this.dwollaService = dwollaService;
  }

  async execute() {
    try {
      // email saying your account has been suspended, contact support
      const customerId = this.event.getResourceId();

      let user;
      user = await this.userRepository.fetchByDwollaId(customerId);

      if (!user) {
        user = await this.issuerRepository.fetchByDwollaCustomerId(customerId);
        if (!user) {
          return false;
        }
      }

      const { status } = await this.dwollaService.getCustomer(customerId);

      if (
        user.investor &&
        user.investor.dwollaVerificationStatus !== status &&
        status === DwollaVerificationStatus.SUSPENDED
      ) {
        user.investor.setDwollaVerificationStatus(status);
        await this.userRepository.update(user);
      } else if (
        user.issuerName &&
        user.issuerStatus !== IssuerStatus.SUSPENDED &&
        status === DwollaVerificationStatus.SUSPENDED
      ) {
        user.issuerStatus = IssuerStatus.SUSPENDED;
        await this.issuerRepository.updateIssuer(user);
      }

      // await this.notifyUser(user);

      return true;
    } catch (error) {
      logger.error(error);

      return false;
    }
  }

  async notifyUser(user) {
    const notificationDTO = new DwollaCustomerDTO({ user });
    const suspendedTemplate = await BakeEmail(notificationDTO, userSuspendedTemplate);
    await SendHtmlEmail(user.email, 'Account Suspended', suspendedTemplate);
  }
}

export default CustomerSuspendedHandler;
