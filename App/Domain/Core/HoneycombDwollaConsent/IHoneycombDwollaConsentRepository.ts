import HoneycombDwollaConsent from '@domain/Core/HoneycombDwollaConsent/HoneycombDwollaConsent';

export const IHoneycombDwollaConsentRepositoryId = Symbol.for(
  'IHoneycombDwollaConsentRepository',
);

export interface IHoneycombDwollaConsentRepository {
  createHoneycombDwollaConsent(options: HoneycombDwollaConsent): Promise<boolean>;
  fetchByIssuerId(issuerId: string): Promise<HoneycombDwollaConsent>;
}
