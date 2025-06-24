import { IDwollaServiceId, IDwollaService } from '@infrastructure/Service/IDwollaService';
import CreateHoneycombDwollaBusinessConsentsDTO from '@application/HoneycombDwollaConsent/CreateHoneycombDwollaBusinesConsentDTO';
import {
  IHoneycombDwollaConsentServiceId,
  IHoneycombDwollaConsentService,
} from '@application/HoneycombDwollaConsent/IHoneycombDwollaConsentService';
import { inject, injectable } from 'inversify';
import CreateHoneycombDwollaPersonalConsentDTO from '@application/HoneycombDwollaConsent/CreateHoneycombDwollaPersonalConsentDTO';
@injectable()
class HoneycombDwollaConsentController {
  constructor(
    @inject(IHoneycombDwollaConsentServiceId)
    private honeycombDwollaConsentService: IHoneycombDwollaConsentService,
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
  ) {}

  createBusinessCustomerWithController = async (httpRequest) => {
    const { issuerId, businessClassificationId, email, userEmail } = httpRequest.body;
    const input = new CreateHoneycombDwollaBusinessConsentsDTO(
      issuerId,
      businessClassificationId,
      email,
      userEmail,
    );
    await this.honeycombDwollaConsentService.createBusinessCustomerWithController(input);
    return {
      body: {
        status: 'success',
        message: 'Dwolla Business Customer with Controller Created Successfully',
      },
    };
  };

  createPersonalCustomer = async (httpRequest) => {
    const { userId } = httpRequest.query;
    const input = new CreateHoneycombDwollaPersonalConsentDTO(userId);
    await this.honeycombDwollaConsentService.createPersonalCustomer(input);
    return {
      body: {
        status: 'success',
        message: 'Dwolla Personal Customer Created Successfully',
      },
    };
  };
}

export default HoneycombDwollaConsentController;
