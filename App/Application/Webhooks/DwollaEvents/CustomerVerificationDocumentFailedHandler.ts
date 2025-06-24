import logger from '@infrastructure/Logger/logger';
import DwollaCustomerDTO from './DwollaCustomerDTO';
import MailService from '@infrastructure/Service/MailService';
import EmailTemplates from '@domain/Utils/EmailTemplates';
import { IUserMediaRepository } from '@domain/Core/UserMedia/IUserMediaRepository';

const { SendHtmlEmail, BakeEmail } = MailService;
const { userDocumentFailedTemplate, DocumentUploadSampleTemplate } = EmailTemplates;

class CustomerVerificationDocumentFailedHandler {
  private event: any;
  private userMediaRepository: IUserMediaRepository;

  constructor(event: any, userMediaRepository: IUserMediaRepository) {
    this.event = event;
    this.userMediaRepository = userMediaRepository;
  }

  async execute() {
    try {
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
    const documentFailedTemplate = await BakeEmail(
      notificationDTO,
      userDocumentFailedTemplate,
    );
    const documentSampleTemplate = await BakeEmail(
      notificationDTO,
      DocumentUploadSampleTemplate,
    );
    await SendHtmlEmail(
      document.user.email,
      'Id Verification Failed',
      documentFailedTemplate,
    );
    await SendHtmlEmail(
      document.user.email,
      'Miventure - ID Submission Tips',
      documentSampleTemplate,
    );
    return true;
  }
}

export default CustomerVerificationDocumentFailedHandler;
