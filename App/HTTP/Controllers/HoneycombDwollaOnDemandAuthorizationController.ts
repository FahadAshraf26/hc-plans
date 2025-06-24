import {
  IHoneycombDwollaOnDemandAuthorizationId,
  IHoneycombDwollaOnDemandAuthorization,
} from '@application/DwollaOnDemandAuthorization/IHoneycombDwollaOnDemandAuthorization';
import { inject, injectable } from 'inversify';

@injectable()
class HoneycombDwollaOnDemandAuthorizationController {
  constructor(
    @inject(IHoneycombDwollaOnDemandAuthorizationId)
    private honeycombDwolaOnDemandAuthorizationService: IHoneycombDwollaOnDemandAuthorization,
  ) {}

  getDwollaOnDemandAuthorization = async (httpReqeuest) => {
    const response = await this.honeycombDwolaOnDemandAuthorizationService.getOnDemandAuthorization();
    return {
      body: {
        status: 'success',
        data: response,
      },
    };
  };
}

export default HoneycombDwollaOnDemandAuthorizationController;
