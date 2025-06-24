import 'reflect-metadata';
import { IHoneycombDwollaOnDemandAuthorization } from './IHoneycombDwollaOnDemandAuthorization';
import { IDwollaServiceId, IDwollaService } from '@infrastructure/Service/IDwollaService';
import { inject, injectable } from 'inversify';

@injectable()
class HoneycombDwollaOnDemandAuthorization
  implements IHoneycombDwollaOnDemandAuthorization {
  constructor(@inject(IDwollaServiceId) private dwollaService: IDwollaService) {}

  async getOnDemandAuthorization() {
    const response = await this.dwollaService.getOnDemandAuthorization();

    return response;
  }
}

export default HoneycombDwollaOnDemandAuthorization;
