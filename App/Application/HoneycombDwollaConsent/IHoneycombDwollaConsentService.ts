import CreateHoneycombDwollaBusinessConsentsDTO from './CreateHoneycombDwollaBusinesConsentDTO';
import CreateHoneycombDwollaPersonalConsentDTO from './CreateHoneycombDwollaPersonalConsentDTO';
export const IHoneycombDwollaConsentServiceId = Symbol.for(
  'IHoneycombDwollaConsentService',
);

export interface IHoneycombDwollaConsentService {
  createBusinessCustomerWithController(
    options: CreateHoneycombDwollaBusinessConsentsDTO,
  ): Promise<any>;
  createPersonalCustomer(options: CreateHoneycombDwollaPersonalConsentDTO): Promise<any>;
}
