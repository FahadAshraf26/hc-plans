import HoneycombDwollaBeneficialOwner from './HoneycombDwollaBeneficialOwner';

export const IHoneycombDwollaBeneficialOwnerRepositoryId = Symbol.for(
  'IHoneycombDwollaBeneficialOwnerRepository',
);

export interface IHoneycombDwollaBeneficialOwnerRepository {
  createDwollaBeneficialOwner(option: HoneycombDwollaBeneficialOwner): Promise<boolean>;
  fetchByDwollaCustomerId(
    dwollaCustomerId: string,
  ): Promise<HoneycombDwollaBeneficialOwner>;
}
