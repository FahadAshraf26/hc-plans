import CreateHoneycombDwollaBeneficialOwnerDTO from './CreateHoneycombDwollaBeneficialOwnerDTO';

export const IHoneycombDwollaBeneficialOwnerServiceId = Symbol.for(
  'IHoneycombDwollaBeneficialOwnerService',
);

export interface IHoneycombDwollaBeneficialOwnerService {
  createHoneycombDwollaBeneficialOwner(
    option: CreateHoneycombDwollaBeneficialOwnerDTO,
  ): Promise<any>;
}
