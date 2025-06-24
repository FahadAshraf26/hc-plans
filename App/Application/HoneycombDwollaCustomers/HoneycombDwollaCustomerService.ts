import GetHoneycombWalletDetailDTO from './GetHoneycombWalletDetailDTO';
import {
  IHoneycombDwollaCustomerRepositoryId,
  IHoneycombDwollaCustomerRepository,
} from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import { inject, injectable } from 'inversify';

@injectable()
class HoneycombDwollaCustomerService {
  constructor(
    @inject(IHoneycombDwollaCustomerRepositoryId)
    private dwollaCustomerRepository: IHoneycombDwollaCustomerRepository,
  ) {}

  async getHoneycombWalletDetail(
    getHoneycombWalletDetailDTO: GetHoneycombWalletDetailDTO,
  ) {
    const userId = getHoneycombWalletDetailDTO.getUserId();
    const userWallet = await this.dwollaCustomerRepository.fetchAllByUserId(userId);
    return userWallet;
  }
}

export default HoneycombDwollaCustomerService;
