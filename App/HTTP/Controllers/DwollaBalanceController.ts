import { IDwollaServiceId, IDwollaService } from '@infrastructure/Service/IDwollaService';
import { inject, injectable } from 'inversify';

@injectable()
class DwollaBalanceController {
  constructor(@inject(IDwollaServiceId) private dwollaService: IDwollaService) {}

  getDwollaBalanceId = async (httpRequest) => {
    const { customerId } = httpRequest.params;
    const response = await this.dwollaService.listFundingSources(customerId);
    return {
      body: {
        status: 'success',
        data: response,
      },
    };
  };

  getDwollaBalance = async (httpRequest) => {
    const { dwollaBalanceId } = httpRequest.params;
    const response = await this.dwollaService.retrieveFundingSourceBalance(
      dwollaBalanceId,
    );
    return {
      body: {
        status: 'success',
        data: response,
      },
    };
  };
}

export default DwollaBalanceController;
