import { IHoneycombDwollaCustomerRepository } from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import logger from '@infrastructure/Logger/logger';
import { IssuerStatus } from '@domain/Core/ValueObjects/IssuerStatus';
import { DwollaVerificationStatus } from '@domain/Core/ValueObjects/DwollaVerificationStatus';
import mailService from '@infrastructure/Service/MailService';
import EmailTemplates from '@domain/Utils/EmailTemplates';
import { IUserRepository } from '@domain/Core/User/IUserRepository';
import { IIssuerRepository } from '@domain/Core/Issuer/IIssuerRepository';
import { IDwollaService } from '@infrastructure/Service/IDwollaService';

const { SendHtmlEmail } = mailService;
const { userCreatedTemplate } = EmailTemplates;

class CustomerCreatedHandler {
  private event: any;
  private honeycombDwollCustomerRepository: IHoneycombDwollaCustomerRepository;
  private userRepository: IUserRepository;
  private issuerRepository: IIssuerRepository;
  private dwollaService: IDwollaService;

  constructor(
    event: any,
    honeycombDwollCustomerRepository: IHoneycombDwollaCustomerRepository,
    userRepository: IUserRepository,
    issuerRepository: IIssuerRepository,
    dwollaService: IDwollaService,
  ) {
    this.event = event;
    this.honeycombDwollCustomerRepository = honeycombDwollCustomerRepository;
    this.userRepository = userRepository;
    this.issuerRepository = issuerRepository;
    this.dwollaService = dwollaService;
  }

  async execute() {
    try {
      const customerId = this.event.getResourceId();

      const dwollaCustomer = await this.honeycombDwollCustomerRepository.fetchByDwollaCustomerId(
        customerId,
      );

      let user;
      user = await this.userRepository.fetchById(dwollaCustomer.userId);

      if (!user) {
        user = await this.issuerRepository.fetchById(dwollaCustomer.issuerId);
        if (!user) {
          return false;
        }
      }
      const { status } = await this.dwollaService.getCustomer(customerId);

      if (
        user.investor &&
        user.investor.dwollaVerificationStatus !== status &&
        status === DwollaVerificationStatus.VERIFIED
      ) {
        user.investor.setDwollaVerificationStatus(status);
        await this.userRepository.update(user);
      } else if (
        user.issuerName &&
        user.issuerStatus !== IssuerStatus.APPROVED &&
        status === DwollaVerificationStatus.VERIFIED
      ) {
        user.issuerStatus = IssuerStatus.APPROVED;
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
    const name = user.firstName ? user.firstName : user.issuerName;
    const html = userCreatedTemplate.replace('{@FIRST_NAME}', name);
    await SendHtmlEmail(user.email, 'Your Honeycomb Wallet has been activated', html);
  }
}

export default CustomerCreatedHandler;
