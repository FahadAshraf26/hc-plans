import { IDwollaService } from '@infrastructure/Service/IDwollaService';
import { IHoneycombDwollaCustomerRepository } from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import logger from '@infrastructure/Logger/logger';
import { IUserMediaRepository } from '@domain/Core/UserMedia/IUserMediaRepository';

class CustomerVerificationDocumentNeededHandler {
  private event: any;
  private userMediaRepository: IUserMediaRepository;
  private honeycombDwollCustomerRepository: IHoneycombDwollaCustomerRepository;
  private dwollaService: IDwollaService;

  constructor(
    event: any,
    userMediaRepository: IUserMediaRepository,
    honeycombDwollCustomerRepository: IHoneycombDwollaCustomerRepository,
    dwollaService: IDwollaService,
  ) {
    this.event = event;
    this.userMediaRepository = userMediaRepository;
    this.honeycombDwollCustomerRepository = honeycombDwollCustomerRepository;
    this.dwollaService = dwollaService;
  }

  async execute() {
    try {
      const documentId = this.event.getResourceId();

      const dwollaCustomer = await this.honeycombDwollCustomerRepository.fetchByDocumentId(
        documentId,
      );

      if (dwollaCustomer) {
        const dwollaBalanceDetail = await this.dwollaService.listFundingSources(
          dwollaCustomer.getDwollaCustomerId(),
        );
        const dwollaBalance = dwollaBalanceDetail.filter(
          (item) => item.type === 'balance',
        );
        dwollaCustomer.setDwollaBalanceId(dwollaBalance[0].id);
        await this.honeycombDwollCustomerRepository.updateByIssuer(dwollaCustomer);
      }

      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }
}

export default CustomerVerificationDocumentNeededHandler;
