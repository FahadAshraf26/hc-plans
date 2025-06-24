import logger from '@infrastructure/Logger/logger';
import MailService from '@infrastructure/Service/MailService';
import DwollaCustomerDTO from './DwollaCustomerDTO';
import EmailTemplates from '@domain/Utils/EmailTemplates';
import { IUserMediaRepository } from '@domain/Core/UserMedia/IUserMediaRepository';

const { SendHtmlEmail, BakeEmail } = MailService;
const { customerVerificationDocumentUploadedTemplate } = EmailTemplates;

class CustomerVerificationDocumentUploadedHandler {
  private event: any;
  private userMediaRepository: IUserMediaRepository;

  constructor(event: any, userMediaRepository: IUserMediaRepository) {
    this.event = event;
    this.userMediaRepository = userMediaRepository;
  }

  async execute() {
    try {
      // email saying your account has been suspended, contact support
      const documentId = this.event.getResourceId();

      return await this.notifyInvestor(documentId);
    } catch (error) {
      logger.error(error);

      return false;
    }
  }

  async notifyInvestor(documentId) {
    const document = await this.userMediaRepository.fetchByDwollaDocumentId(documentId);
    if (!document) {
      return false;
    }
    const notificationDTO = new DwollaCustomerDTO(document);
    const documentUploadedTemplate = await BakeEmail(
      notificationDTO,
      customerVerificationDocumentUploadedTemplate,
    );
    // await SendHtmlEmail(
    //   document.user.email,
    //   'Id Verification Submitted',
    //   documentUploadedTemplate,
    // );
    return true;
  }
}

export default CustomerVerificationDocumentUploadedHandler;
