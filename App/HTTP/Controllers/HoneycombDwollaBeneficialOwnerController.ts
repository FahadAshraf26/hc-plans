import { IDwollaServiceId, IDwollaService } from '@infrastructure/Service/IDwollaService';
import {
  IHoneycombDwollaBeneficialOwnerServiceId,
  IHoneycombDwollaBeneficialOwnerService,
} from '@application/HoneycombDwollaBeneficialOwner/IHoneycombDwollaBeneficialOwnerService';
import CreateHoneycombDwollaBeneficialOwnerDTO from '@application/HoneycombDwollaBeneficialOwner/CreateHoneycombDwollaBeneficialOwnerDTO';
import { inject, injectable } from 'inversify';

@injectable()
class HoneycombDwollaBeneficialOwnerController {
  constructor(
    @inject(IHoneycombDwollaBeneficialOwnerServiceId)
    private honeycombDwollaBeneficialOwnerService: IHoneycombDwollaBeneficialOwnerService,
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
  ) {}

  createHoneycombDwollaBeneficialOwner = async (httpRequest) => {
    const { issuerId } = httpRequest.query;
    const input = new CreateHoneycombDwollaBeneficialOwnerDTO(issuerId);
    await this.honeycombDwollaBeneficialOwnerService.createHoneycombDwollaBeneficialOwner(
      input,
    );
    return {
      body: {
        status: 'success',
        message: 'Dwolla Beneficial Owner Created',
      },
    };
  };

  certifyBeneficialOwner = async (httpRequest) => {
    const { dwollaCustomerId } = httpRequest.params;
    const result = await this.dwollaService.certifyOwner(dwollaCustomerId);
    return {
      body: {
        status: 'success',
        message: result,
      },
    };
  };
}

export default HoneycombDwollaBeneficialOwnerController;
