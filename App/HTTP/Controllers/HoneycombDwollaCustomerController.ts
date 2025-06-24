import GetHoneycombWalletDetailDTO from '@application/HoneycombDwollaCustomers/GetHoneycombWalletDetailDTO';
import {
  IHoneycombDwollaCustomerServiceId,
  IHoneycombDwollaCustomerService,
} from '@application/HoneycombDwollaCustomers/IHoneycombDwollaCustomerService';
import { inject, injectable } from 'inversify';

@injectable()
class HoneycombDwollaCustomerController {
  constructor(
    @inject(IHoneycombDwollaCustomerServiceId)
    private honeycombDwollaCustomerService: IHoneycombDwollaCustomerService,
  ) {}

  getHoneycombWalletDetail = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const input = new GetHoneycombWalletDetailDTO(userId);
    const userWallet = await this.honeycombDwollaCustomerService.getHoneycombWalletDetail(
      input,
    );
    return {
      body: {
        status: 'succes',
        data: userWallet,
      },
    };
  };
}

export default HoneycombDwollaCustomerController;
