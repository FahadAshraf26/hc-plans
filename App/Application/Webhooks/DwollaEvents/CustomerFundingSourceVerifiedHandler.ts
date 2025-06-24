import logger from '@infrastructure/Logger/logger';
import mailService from '@infrastructure/Service/MailService';
import DwollaCustomerFundingSourceDTO from './DwollaCustomerFundingSourceDTO';
import EmailTemplates from '@domain/Utils/EmailTemplates';
import { ICampaignEscrowBankRepository } from '@domain/Core/CampaignEscrowBank/ICampaignEscrowBankRepository';

const { SendHtmlEmail, BakeEmail } = mailService;
const { customerFundingSourceVerifiedIssuerTemplate } = EmailTemplates;

class CustomerFundingSourceVerifiedHandler {
  private event: any;
  private campaignEscrowBankRepository: ICampaignEscrowBankRepository;
  constructor(event: any, campaignEscrowBankRepository) {
    this.event = event;
    this.campaignEscrowBankRepository = campaignEscrowBankRepository;
  }

  /**
   * It will notify both investor and issuer
   * @returns {Promise<boolean>}
   */
  async execute() {
    try {
      // email saying your account has been suspended, contact support
      const dwollaSourceId = this.event.getResourceId();

      // await this.notifyIssuer(dwollaSourceId);

      return true;
    } catch (error) {
      logger.error(error);

      return false;
    }
  }

  /**
   * It will notify issuer
   * @param customerId
   * @returns {Promise<boolean>}
   */
  async notifyIssuer(customerId) {
    const escrowBank = await this.campaignEscrowBankRepository.fetchByDwollaSourceId(
      customerId,
    );
    if (!escrowBank) {
      return false;
    }
    const notificationDTO = new DwollaCustomerFundingSourceDTO(escrowBank.campaign);
    const fundingSourceVerifiedIssuerTemplate = await BakeEmail(
      notificationDTO,
      customerFundingSourceVerifiedIssuerTemplate,
    );
    await SendHtmlEmail(
      escrowBank.campaign.issuer.email,
      'Bank Account Connected',
      fundingSourceVerifiedIssuerTemplate,
    );
  }
}

export default CustomerFundingSourceVerifiedHandler;
